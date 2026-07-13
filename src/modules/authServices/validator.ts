// src/modules/authServices/validator.ts

import { z } from "zod";
import { UserType } from "@prisma/client";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First Name must be at least 2 characters" }),

  lastName: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  passwordHash: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),

  mobileNumber: z.string().min(1, { message: "Mobile Number is required" }),

  countryCode: z.string().min(1, { message: "Country Code is required" }),

  user_type: z.nativeEnum(UserType),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  passwordHash: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type RegisterUserInput = z.infer<typeof registerSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
