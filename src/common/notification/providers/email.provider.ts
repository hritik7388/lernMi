// src/common/notification/providers/email.provider.ts
import { mailTransporter } from "../../infrastructure/mail";
import { env } from "../../../config/env";
import logger from "../../../config/logger";

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
  attachments?: {
    filename: string;
    path: string;
  }[];
}

export class EmailProvider {
  async send(payload: EmailNotification): Promise<void> {
    try {
      const info = await mailTransporter.sendMail({
        from: env.SMTP_FROM,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        cc: payload.cc,
        bcc: payload.bcc,
        attachments: payload.attachments,
      });

      logger.info("📧 Email sent successfully", {
        to: payload.to,
        subject: payload.subject,
        messageId: info.messageId,
      });
    } catch (error: any) {
      logger.error("❌ Failed to send email", {
        to: payload.to,
        subject: payload.subject,
        message: error.message,
      });

      throw error;
    }
  }
}

export default new EmailProvider();