"use strict";
// src/modules/authServices/validator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(2, { message: "First Name must be at least 2 characters" }),
    lastName: zod_1.z
        .string()
        .min(2, { message: "Last Name must be at least 2 characters" }),
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    passwordHash: zod_1.z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),
    mobileNumber: zod_1.z
        .string()
        .min(1, { message: "Mobile Number is required" }),
    countryCode: zod_1.z
        .string()
        .min(1, { message: "Country Code is required" }),
    user_type: zod_1.z.nativeEnum(client_1.UserType),
});
