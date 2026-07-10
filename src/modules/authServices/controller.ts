// src/modules/authServices/controller.ts
import { Request, Response } from "express";

import { AuthService } from "./service";
import { RegisterUserInput } from "./validator";
import { catchAsync, ApiResponse } from "../../common/utils";

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  registerUser = catchAsync(
    async (
      req: Request<{}, {}, RegisterUserInput>,
      res: Response,
    ): Promise<void> => {
      const result = await this.authService.registerUser(req.body);
      ApiResponse.success(res, 201, result.message, result.data);
    },
  );
  loginUser = catchAsync(
    async (
      req: Request<{}, {}, RegisterUserInput>,
      res: Response,
    ): Promise<void> => {
      const result = await this.authService.loginUser(req.body);
      ApiResponse.success(res, 200, result.message, result.data);
    },
  );
}
