// src/common/templates/email/forgot-password.ts

import { emailLayout } from "../layout.template";

export const forgotPasswordTemplate = (otp: string) =>
  emailLayout(`
<h2>Forgot Password</h2>

<p>Your OTP is</p>

<h1>${otp}</h1>

<p>This OTP is valid for <b>3 minutes</b>.</p>

<p>If you didn't request this, ignore this email.</p>
`);