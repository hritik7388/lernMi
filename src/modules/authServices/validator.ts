// src/modules/authServices/validator.ts

import { z } from "zod";
import { UserType } from "@prisma/client";

// ---------------- Common Validators ----------------

const nameValidator = (field: string) =>
  z.string().min(2, {
    message: `${field} must be at least 2 characters`,
  });

const emailValidator = z
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" });

const passwordValidator = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" });

const mobileValidator = z
  .string()
  .min(1, { message: "Mobile Number is required" });

const countryCodeValidator = z
  .string()
  .min(1, { message: "Country Code is required" });

const userFields = {
  firstName: nameValidator("First Name"),
  lastName: nameValidator("Last Name"),
  email: emailValidator,
  passwordHash: passwordValidator,
  mobileNumber: mobileValidator,
  countryCode: countryCodeValidator,
};

// ---------------- Register ----------------

export const registerSchema = z.object({
  ...userFields,
  user_type: z.nativeEnum(UserType),
});

// ---------------- Update ----------------

export const updateschema = z.object({
  ...userFields,
});

// ---------------- Login ----------------

export const loginSchema = z.object({
  email: emailValidator,
  passwordHash: passwordValidator,
});

// ---------------- Verify OTP ----------------

export const verifySchema = z.object({
  email: emailValidator,
  otp: z.string().min(1, { message: "OTP is required" }),
});

// ---------------- Change Password ----------------

export const chnagePasswordSchema = z
  .object({
    oldPasswordHash: passwordValidator,
    newPasswordHash: passwordValidator,
    confirmPasswordHash: passwordValidator,
  })
  .refine((data) => data.newPasswordHash === data.confirmPasswordHash, {
    path: ["confirmPasswordHash"],
    message: "New password and confirm password do not match",
  });

  // ---------------- Device FCM ----------------

export const updateFcmTokenSchema = z.object({
  deviceId:z.string().trim().min(1, { message: "FCM Token is required" }),
  device_FCM_Id: z.string().trim().min(1, { message: "FCM Token is required" }),

  deviceName: z.string().trim().min(1, { message: "Device name is required" }),

  deviceType: z.string().trim().min(1, { message: "Device type is required" }),

  osVersion: z.string().trim().min(1, { message: "OS version is required" }),

  appVersion: z.string().trim().min(1, { message: "App version is required" }),

  ipAddress: z.string().trim().min(1, { message: "IP address is required" }),
});

// ---------------- Types ----------------

export type RegisterUserInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateschema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
export type VerifyInput = z.infer<typeof verifySchema>;
export type ChangePasswordInput = z.infer<typeof chnagePasswordSchema>;
export type UpdateFcmTokenInput = z.infer<typeof updateFcmTokenSchema>;
