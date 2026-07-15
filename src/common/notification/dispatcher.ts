// src/common/notification/dispatcher.ts

import logger from "../../config/logger";

import { NotificationChannel } from "../enums/notification-channel.enum";
import { NotificationTemplate } from "../enums/notification-template.enum";

import { NotificationPayload } from "../interfaces/notification.interface";

import emailProvider from "./providers/email.provider";
import pushProvider from "./providers/push.provider";

import { forgotPasswordTemplate } from "../templates/email/forgot-password";

export class NotificationDispatcher {
  async dispatch(payload: NotificationPayload): Promise<void> {
    logger.info("📨 Dispatching notification", {
      channel: payload.channel,
      to: payload.to,
      template: payload.template,
    });

    switch (payload.channel) {
      case NotificationChannel.EMAIL: {
        let html = "";

        switch (payload.template) {
          case NotificationTemplate.PASSWORD_RESET:
            html = forgotPasswordTemplate(
              payload.data.otp as string,
            );
            break;

          default:
            throw new Error(
              `Unsupported Email Template : ${payload.template}`,
            );
        }

        await emailProvider.send({
          to: payload.to,

          subject: payload.subject ?? "Notification",

          html,
        });

        break;
      }

      case NotificationChannel.PUSH: {
        await pushProvider.send({
          token: payload.to,

          title: payload.subject ?? "Notification",

          body: payload.data.body as string,

          data: payload.data.data as Record<string, string>,
        });

        break;
      }

      default:
        throw new Error("Unsupported Notification Channel");
    }

    logger.info("✅ Notification sent", {
      channel: payload.channel,
      to: payload.to,
    });
  }
}

export default new NotificationDispatcher();