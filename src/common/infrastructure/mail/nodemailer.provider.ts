import nodemailer from "nodemailer";
import { env } from "../../../config/env";
import logger from "../../../config/logger";

export const mailTransporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: Number(env.SMTP_PORT) === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
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