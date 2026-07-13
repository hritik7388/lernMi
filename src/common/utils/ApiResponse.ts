// src/common/utils/ApiResponse.ts
import { Response } from "express";

export class ApiResponse {
  static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
  ) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  static error(
    res: Response,
    statusCode: number,
    message: string,
    error?: unknown,
  ) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error,
    });
  }
}
