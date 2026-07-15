// src/modules/authServices/routes.ts
import { Router } from "express";

import { AuthController } from "./controller";
import { registerSchema, loginSchema, verifySchema, updateFcmTokenSchema } from "./validator";
import { validate } from "../../common/middleware";
import { authenticate } from "../../common/middleware/auth.middleware"; 
const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validate(registerSchema),
  authController.registerUser,
);

authRouter.post("/login", validate(loginSchema), authController.loginUser);

authRouter.get("/profile", authenticate, authController.getUserProfile);

authRouter.post("/forget-password", authController.forgetPassword);

authRouter.post("/verify-otp",validate(verifySchema),authController.verifyOtp)

authRouter.post("/reset-password", authenticate, authController.resetPassowrd);

authRouter.post("/chnage-password", authenticate, authController.chnagePassword);

authRouter.post("/update-device",validate(updateFcmTokenSchema),authenticate,authController.updateDevice)

export default authRouter;
