// src/common/templates/email/verify-email.ts

import { emailLayout } from "../layout.template";

export const verifyEmailTemplate = (otp: string) =>
  emailLayout(`
<h2>Email Verification</h2>

<p>Please verify your email using the OTP below.</p>

<h1>${otp}</h1>

<p>This OTP expires in 3 minutes.</p>
`);