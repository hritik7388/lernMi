// src/modules/authServices/service.ts
import { AuthRepository } from "./repository";
import { AppError, HttpStatus } from "../../common/errors";
import { BcryptHelper } from "../../common/helper/bcrypt.helper";
import { RegisterUserInput, LoginUserInput } from "./validator";
import { JwtHelper } from "../../common/helper/jwt.helper";

export class AuthService {
  private repository: AuthRepository;

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
      id: emailExists.cred_id,
      email: emailExists.email,
    });

    return {
      success: true,
      message: "Login successful.",
      data: {
        refreshToken,
        usertype: userProfile.user_type,
      },
    };
  }
}
