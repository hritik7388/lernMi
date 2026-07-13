// src/common/middleware/error.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError, HttpStatus } from "../errors";
import logger from "../../config/logger";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      errorCode: error.errorCode,
      details: error.details ?? null,
    });
  }

  if (error instanceof ZodError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Validation failed",
      errors: error.flatten(),
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
  });
};
