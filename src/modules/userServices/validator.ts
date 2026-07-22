// src/modules/userServices/validator.ts
import { z } from "zod";
import { UserType } from "@prisma/client";

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
export const CreateUserSchema = z.object({
  ...userFields,
  user_type: z.nativeEnum(UserType),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;