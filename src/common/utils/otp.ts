// src/common/utils/otp.ts
import crypto from "node:crypto";

export const OTP_EXPIRY_SECONDS = 3 * 60; // 3 minutes

export const generateOTP = (length: number = 6): string => {
  const digits = "0123456789";
  let otp = "";

  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % digits.length];
  }

  return otp;
};
