import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../../config/env";
import { redisClient } from "../../config/redis";

import { AppError } from "../errors/AppError";
import { HttpStatus } from "../errors";
import { catchAsync } from "../utils/catchAsync";

interface JwtPayload {
  credId: string;
  email: string;
  userType: string;
}

export const authenticate = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(
        "Unauthorized. Access token is missing.",
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      throw new AppError(
        "Invalid or expired access token.",
        HttpStatus.UNAUTHORIZED
      );
    }

    // Optional: Validate active session from Redis
    const session = await redisClient.get(`session:${decoded.credId}`);

    if (!session) {
      throw new AppError(
        "Session expired. Please login again.",
        HttpStatus.UNAUTHORIZED
      );
    }

    req.user = {
      credId: decoded.credId,
      email: decoded.email,
      userType: decoded.userType,
    };

    next();
  }
);