// src/common/notification/dispatcher.ts

import logger from "../../config/logger";

import { NotificationChannel } from "../enums/notification-channel.enum";
import { NotificationTemplate } from "../enums/notification-template.enum";

import { NotificationPayload } from "./notification.service";

import emailProvider, {
  EmailNotification,
} from "./providers/email.provider";

import pushProvider, {
  PushNotification,
} from "./providers/push.provider";

import { forgotPasswordTemplate } from "../templates/email/forgot-password";

export class NotificationDispatcher {
  async dispatch(payload: NotificationPayload): Promise<void> {
    logger.info("📨 Dispatching notification", {
      channel: payload.channel,
      recipient: payload.recipient,
      template: payload.template,
    });

    switch (payload.channel) {
      case NotificationChannel.EMAIL: {
        let html = "";

   if (payload.template === NotificationTemplate.PASSWORD_RESET) {
  html = forgotPasswordTemplate(payload.data.otp as string);
} else {
  throw new Error(
    `Unsupported email template: ${payload.template}`
  );
}

        await emailProvider.send({
          to: payload.recipient,
          subject: payload.subject ?? "Notification",
          html,
        } as EmailNotification);

        break;
      }

      case NotificationChannel.PUSH: {
        await pushProvider.send({
          token: payload.recipient,
          title: payload.subject ?? "Notification",
          body: payload.data.body as string,
          data: payload.data.data as Record<string, string>,
        } as PushNotification);

        break;
      }

      default:
        throw new Error(
          `Unsupported notification channel: ${payload.channel}`
        );
    }

    logger.info("✅ Notification dispatched successfully", {
      channel: payload.channel,
      recipient: payload.recipient,
    });
  }
}

export default new NotificationDispatcher();