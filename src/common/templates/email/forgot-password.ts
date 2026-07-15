// src/common/templates/email/forgot-password.ts

export const forgotPasswordTemplate = (otp: string): string => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
</head>

<body
style="
font-family:Arial;
background:#f4f4f4;
padding:40px;
">

<div
style="
max-width:600px;
margin:auto;
background:#fff;
padding:30px;
border-radius:8px;
">

<h2>Password Reset</h2>

<p>Your OTP is</p>

<h1>${otp}</h1>

<p>This OTP is valid for 3 minutes.</p>

</div>

</body>
</html>
`;