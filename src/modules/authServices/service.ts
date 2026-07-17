// src/modules/authServices/service.ts
import { AuthRepository } from "./repository";
import { AppError, HttpStatus } from "../../common/errors";
import { BcryptHelper } from "../../common/helper/bcrypt.helper";
import {
  RegisterUserInput,
  LoginUserInput,
  VerifyInput,
  ChangePasswordInput,
  UpdateFcmTokenInput,
  UpdateUserInput,
  LogOutInput,
} from "./validator";
import { JwtHelper } from "../../common/helper/jwt.helper";
import { redisClient } from "../../config/redis";
import { generateOTP } from "../../common/utils/otp";
import { notificationService } from "../../common/notification/notification.service";
import { NotificationChannel } from "../../common/enums/notification-channel.enum";
import { NotificationTemplate } from "../../common/enums/notification-template.enum";
import NotificationModuleService from "../notification/notification.service";

const OTP_EXPIRY_SECONDS = 3 * 60;

export class AuthService {
  private readonly repository: AuthRepository;
  constructor() {
    this.repository = new AuthRepository();
  }
  async registerUser(userData: RegisterUserInput) {
    const { emailExists, mobileExists } = await this.repository.checkUserExists(
      userData.email,
      userData.mobileNumber,
    );
    if (emailExists || mobileExists) {
      throw new AppError(
        "User with this email or mobile number already exists",
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await BcryptHelper.hash(userData.passwordHash);

    const { credential, profile } = await this.repository.createUser({
      ...userData,
      passwordHash: passwordHash,
    });
    const userRes = {
      cred_id: credential.cred_id,
      email: credential.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      mobileNumber: profile.mobileNumber,
      countryCode: profile.countryCode,
      user_type: profile.user_type,
    };

    return {
      message: "User registered successfully",
      data: userRes,
    };
  }
  async updateProfile(credId: string, data: UpdateUserInput) {
    const user = await this.repository.findUserByCredId(credId);

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    const profile = await this.repository.checkUserActive(credId);

    if (!profile) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.repository.updateUserProfile(
      profile.user_id,
      
      data,
    );

    return {
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    };
  }
  async loginUser(userData: LoginUserInput) {
    const emailExists = await this.repository.findUserByEmail(userData.email);
    if (!emailExists) {
      throw new AppError(
        "User with this email does not exist",
        HttpStatus.NOT_FOUND,
      );
    }
    const userProfile = await this.repository.checkUserActive(
      emailExists.cred_id,
    );
    if (!userProfile) {
      throw new AppError(
        "User profile Deleted Unverified or not Active",
        HttpStatus.NOT_FOUND,
      );
    }
    const isPasswordValid = await BcryptHelper.compare(
      userData.passwordHash,
      emailExists.passwordHash,
    );
    if (!isPasswordValid) {
      await this.repository.incrementFailedLoginAttempts(emailExists.cred_id);

      throw new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }
    await this.repository.updateLoginSuccess(emailExists.cred_id);
    const { refreshToken } = JwtHelper.generateToken({
      credId: emailExists.cred_id,
      email: emailExists.email,
      userType: userProfile.user_type,
    });
    await redisClient.set(
      `session:${emailExists.cred_id}`,
      refreshToken,
      "EX",
      60 * 60 * 24 * 7,
    );
    return {
      success: true,
      message: "Login successful.",
      data: {
        refreshToken,
        usertype: userProfile.user_type,
      },
    };
  }
  async getUserProfile(credId: string) {
    const userProfile = await this.repository.getUserProfile(credId);
    if (!userProfile) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }
    return {
      message: "User profile fetched successfully",
      data: userProfile,
    };
  }
  async forgetPassword(email: string) {
    const emailExists = await this.repository.findUserByEmail(email);
    if (!emailExists) {
      throw new AppError(
        "User with this email does not exist",
        HttpStatus.NOT_FOUND,
      );
    }
    const userProfile = await this.repository.checkUserActive(
      emailExists.cred_id,
    );
    if (!userProfile) {
      throw new AppError(
        "User profile Deleted Unverified or not Active",
        HttpStatus.NOT_FOUND,
      );
    }

    const otp = generateOTP();

    // Store OTP in Redis for 3 minutes
    await redisClient.set(
      `forgot-password:${emailExists.email}`,
      otp,
      "EX",
      OTP_EXPIRY_SECONDS,
    );

    await Promise.all([
      notificationService.send({
        channel: NotificationChannel.EMAIL,
        template: NotificationTemplate.PASSWORD_RESET,
        to: emailExists.email,
        subject: "Reset Password OTP",
        data: {
          otp,
        },
      }),

      NotificationModuleService.sendPushToUser(
        emailExists.cred_id,
        "Reset Password",
        "OTP has been sent to your registered email.",
      ),
    ]);

    return {
      message: "OTP sent successfully. It is valid for 3 minutes.",
      data: otp,
    };
  }
  async verifyOtp(userData: VerifyInput) {
    const emailExists = await this.repository.findUserByEmail(userData.email);

    if (!emailExists) {
      throw new AppError(
        "User with this email does not exist",
        HttpStatus.NOT_FOUND,
      );
    }

    const userProfile = await this.repository.checkUserVerify(
      emailExists.cred_id,
    );

    if (!userProfile) {
      throw new AppError(
        "User profile Deleted or not Active.",
        HttpStatus.NOT_FOUND,
      );
    }

    const redisKey = `forgot-password:${emailExists.email}`;

    const storedOtp = await redisClient.get(redisKey);

    if (!storedOtp) {
      throw new AppError(
        "OTP has expired. Please request a new one.",
        HttpStatus.GONE,
      );
    }

    if (storedOtp !== userData.otp) {
      throw new AppError("Invalid OTP.", HttpStatus.BAD_REQUEST);
    }
    await this.repository.updateOtpVerification(emailExists.cred_id);
    await redisClient.del(redisKey);
    const resetToken = JwtHelper.generateToken({
      credId: emailExists.cred_id,
      email: emailExists.email,
      userType: userProfile.user_type,
    });

    return {
      success: true,
      message: "OTP verified successfully.",
      data: {
        resetToken,
      },
    };
  }
  async resetPassword(credId: string, passwordHash: string) {
    const userCred = await this.repository.findUserByCredId(credId);
    if (!userCred) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }
    const userProfile = await this.repository.checkUserActive(userCred.cred_id);
    if (!userProfile) {
      throw new AppError(
        "User profile Deleted Unverified or not Active",
        HttpStatus.NOT_FOUND,
      );
    }
    const isSamePassword = await BcryptHelper.compare(
      passwordHash,
      userCred.passwordHash,
    );
    if (isSamePassword) {
      throw new AppError(
        "New password cannot be the same as the old password.",
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await BcryptHelper.hash(passwordHash);
    await Promise.all([
      this.repository.updatePassword(credId, hashedPassword),
      redisClient.del(`session:${userCred.cred_id}`),
    ]);

    return {
      success: true,
      message: "Password reset successfully.",
    };
  }
  async chnagePassword(credId: string, userData: ChangePasswordInput) {
    const userCred = await this.repository.findUserByCredId(credId);
    if (!userCred) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }
    const userProfile = await this.repository.checkUserActive(userCred.cred_id);
    if (!userProfile) {
      throw new AppError(
        "User profile Deleted Unverified or not Active",
        HttpStatus.NOT_FOUND,
      );
    }
    const isOldPassword = await BcryptHelper.compare(
      userData.oldPasswordHash,
      userCred.passwordHash,
    );
    if (!isOldPassword) {
      throw new AppError("Old password is incorrect.", HttpStatus.BAD_REQUEST);
    }

    if (userData.newPasswordHash !== userData.confirmPasswordHash) {
      throw new AppError(
        "new password cannot be the same as the confirm  password.",
        HttpStatus.BAD_REQUEST,
      );
    }
    const isSamePassword = await BcryptHelper.compare(
      userData.newPasswordHash,
      userCred.passwordHash,
    );

    if (isSamePassword) {
      throw new AppError(
        "New password cannot be the same as the old password.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await BcryptHelper.hash(userData.newPasswordHash);
    await Promise.all([
      this.repository.updatePassword(credId, hashedPassword),
      redisClient.del(`session:${userCred.cred_id}`),
    ]);

    return {
      success: true,
      message: "Password reset successfully.",
    };
  }
  async updateFcmtoken(credId: string, userData: UpdateFcmTokenInput) {
    const userCred = await this.repository.findUserByCredId(credId);

    if (!userCred) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }

    const existingDevice = await this.repository.findDeviceByFcm(
      userData.device_FCM_Id,
    );

    if (existingDevice) {
      await this.repository.updateDeviceSession(
        existingDevice.session_id,
        userData,
      );

      return {
        success: true,
        message: "Device session updated successfully.",
        data: existingDevice,
      };
    }

    const createDevice = await this.repository.createDeviceSession(
      credId,
      userData,
    );

    return {
      success: true,
      message: "Device session created successfully.",
      data: createDevice,
    };
  }
  async chnageProfile(credId: string, imageUrl: string) {
    const userCred = await this.repository.findUserByCredId(credId);
    if (!userCred) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }
    const userProfile = await this.repository.checkUserActive(userCred.cred_id);
    if (!userProfile) {
      throw new AppError(
        "User profile Deleted Unverified or not Active",
        HttpStatus.NOT_FOUND,
      );
    }
    await this.repository.updateProfileImage(userProfile.user_id, imageUrl);

    return {
      message: "Profile image updated successfully",
    };
  }
  async getAvtar(credId: string) {
    const userCred = await this.repository.findUserByCredId(credId);
    if (!userCred) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }
    const userProfile = await this.repository.checkUserActive(userCred.cred_id);
    if (!userProfile) {
      throw new AppError(
        "User profile Deleted Unverified or not Active",
        HttpStatus.NOT_FOUND,
      );
    }
    const useravtar = await this.repository.getAvtar(userProfile.user_id);
    return {
      message: "Profile get successfully ",
      data: useravtar,
    };
  }
  async logout(credId: string, userData: LogOutInput) {
    const user = await this.repository.findUserByCredId(credId);

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    await Promise.all([
      redisClient.del(`session:${credId}`),
      this.repository.removeDeviceSession(userData.deviceId),
    ]);

    return {
      success: true,
      message: "Logout successfully.",
    };
  }
}
