// src/modules/authServices/service.ts
import { AuthRepository } from "./repository";
import { AppError, HttpStatus } from "../../common/errors";
import { BcryptHelper } from "../../common/helper/bcrypt.helper";
import { RegisterUserInput } from "./validator";

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
    if (emailExists) {
      throw new AppError(
        "User with this email already exists",
        HttpStatus.CONFLICT,
      );
    }
    if (mobileExists) {
      throw new AppError(
        "User with this mobile number already exists",
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
}
