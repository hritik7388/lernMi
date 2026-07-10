// src/common/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../common/errors/AppError";
import { HttpStatus } from "../../common/errors";

interface JwtPayload { 
  credId: string;
  email: string;
  userType: string;
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;

    req.user = { 
      credId: decoded.credId,
      email: decoded.email,
      userType: decoded.userType,
    };

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", HttpStatus.UNAUTHORIZED));
  }
};
