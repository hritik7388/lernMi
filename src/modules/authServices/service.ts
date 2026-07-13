// src/modules/authServices/service.ts
import { AuthRepository } from "./repository";
import { AppError, HttpStatus } from "../../common/errors";
import { BcryptHelper } from "../../common/helper/bcrypt.helper";
import { RegisterUserInput, LoginUserInput } from "./validator";
import { JwtHelper } from "../../common/helper/jwt.helper";
import { redisClient } from "../../config/redis";
import { generateOTP } from "../../common/utils/otp";
import { notificationService } from "../../common/notification/notification.service";
import { NotificationChannel } from "../../common/enums/notification-channel.enum";
import { NotificationTemplate } from "../../common/enums/notification-template.enum";

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
    console.log("credId", credId);
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

    const mail = await notificationService.send({
      channel: NotificationChannel.EMAIL,
      template: NotificationTemplate.PASSWORD_RESET,
      recipient: emailExists.email,
      subject: "Reset Password OTP",
      data: {
        otp,
      },
    });
    console.log("mail===============>>>", mail);

    // // Send email (BullMQ / Nodemailer)
    // await emailQueue.add("forgot-password", {
    //   to: emailExists.email,
    //   subject: "Reset Password OTP",
    //   otp,
    // });

    return {
      success: true,
      message: "OTP sent successfully. It is valid for 3 minutes.",
      data: otp,
    };
  }
}
