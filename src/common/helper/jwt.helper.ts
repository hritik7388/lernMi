// src/common/helper/jwt.helper.ts

import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

export interface JwtPayload { 
  credId: string;
  email: string;
  userType: string;
}

export class JwtHelper {
  private static sign(
    payload: JwtPayload,
    secret: string,
    expiresIn: SignOptions["expiresIn"],
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return this.sign(
      payload,
      env.JWT_REFRESH_SECRET,
      env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    );
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      env.JWT_REFRESH_SECRET,
    ) as JwtPayload;
  }

  static generateToken(payload: JwtPayload) {
    return {
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}