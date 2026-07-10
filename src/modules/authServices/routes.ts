// src/modules/authServices/routes.ts
import { Router } from "express";

import { AuthController } from "./controller";
import { registerSchema } from "./validator";
import { validate } from "../../common/middleware";
const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validate(registerSchema),
  authController.registerUser,
);

export default authRouter;
