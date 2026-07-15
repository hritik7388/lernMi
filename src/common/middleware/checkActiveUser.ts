// src/common/middleware/checkActiveUser.ts

import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../errors/AppError";
import { HttpStatus } from "../errors"; 
import prisma from "../../config/prisma";

export const activeUserMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const credId = req.user?.credId;

    if (!credId) {
      throw new AppError("Unauthorized user", HttpStatus.UNAUTHORIZED);
    }

    const user = await prisma.userCredentials.findUnique({
      where: {
        cred_id: credId,
      },
      select: {
        profile: {
          select: {
            isVerified: true,
            isDeleted: true,
            status: true,
          },
        },
      },
    });

    if (!user?.profile) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }

    const { isVerified, isDeleted, status } = user.profile;

    if (!isVerified) {
      throw new AppError("Account is not verified", HttpStatus.FORBIDDEN);
    }

    if (isDeleted) {
      throw new AppError("Account has been deleted", HttpStatus.FORBIDDEN);
    }

    if (status !== "ACTIVE") {
      throw new AppError("Account is not active", HttpStatus.FORBIDDEN);
    }

    next();
  },
);
