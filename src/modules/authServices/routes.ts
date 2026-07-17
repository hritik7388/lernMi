// src/modules/authServices/routes.ts

import { Router } from "express";
import { AuthController } from "./controller";
import {
  registerSchema,
  loginSchema,
  verifySchema,
  updateFcmTokenSchema,
  updateProfileSchema,
  logoutSchema,
} from "./validator";
import { validate } from "../../common/middleware";
import { authenticate } from "../../common/middleware/auth.middleware";

const authRouter = Router();
const authController = new AuthController();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
authRouter.post(
  "/register",
  validate(registerSchema),
  authController.registerUser,
);

/**
 * @route   PUT /api/v1/auth/update-profile
 * @desc    Update user profile details
 * @access  Private
 */
authRouter.put(
  "/update-profile",
  authenticate,
  validate(updateProfileSchema),
  authController.updateUser,
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and generate JWT
 * @access  Public
 */
authRouter.post(
  "/login",
  validate(loginSchema),
  authController.loginUser,
);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
authRouter.get(
  "/profile",
  authenticate,
  authController.getUserProfile,
);

/**
 * @route   POST /api/v1/auth/forget-password
 * @desc    Send password reset OTP to registered email
 * @access  Public
 */
authRouter.post(
  "/forget-password",
  authController.forgetPassword,
);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify password reset OTP
 * @access  Public
 */
authRouter.post(
  "/verify-otp",
  validate(verifySchema),
  authController.verifyOtp,
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset account password
 * @access  Private
 */
authRouter.post(
  "/reset-password",
  authenticate,
  authController.resetPassowrd,
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change logged-in user's password
 * @access  Private
 */
authRouter.post(
  "/chnage-password",
  authenticate,
  authController.chnagePassword,
);

/**
 * @route   PUT /api/v1/auth/update-device
 * @desc    Register or update device FCM token
 * @access  Private
 */
authRouter.put(
  "/update-device",
  authenticate,
  validate(updateFcmTokenSchema),
  authController.updateDevice,
);

/**
 * @route   PUT /api/v1/auth/change-profile
 * @desc    Update user profile image
 * @access  Private
 */
authRouter.put(
  "/chnage-profile",
  authenticate,
  authController.chnageProfile,
);

/**
 * @route   GET /api/v1/auth/get-profile
 * @desc    Get user profile image/avatar
 * @access  Private
 */
authRouter.get(
  "/get-profile",
  authenticate,
  authController.getAvtar,
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate active session
 * @access  Private
 */
authRouter.post(
  "/logout",
  authenticate,
  validate(logoutSchema),
  authController.logOut,
);

export default authRouter;