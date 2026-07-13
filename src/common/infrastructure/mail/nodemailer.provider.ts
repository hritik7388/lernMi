// src/common/infrastructure/mail/nodemailer.provider.ts
import nodemailer from "nodemailer";
import { env } from "../../../config/env";
import logger from "../../../config/logger";

export const mailTransporter = nodemailer.createTransport({
  service: env.SMTP_HOST,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },

  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});
console.log({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  passLoaded: !!env.SMTP_PASS,
});
mailTransporter.verify()
  .then(() => {
    logger.info("📧 Nodemailer transporter initialized");
  })
  .catch((error: { message: any; }) => {
    logger.error("❌ Failed to initialize mail transporter", {
      message: error.message,
    });
  });