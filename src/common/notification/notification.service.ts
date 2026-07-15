// src/common/notification/notification.service.ts

import logger from "../../config/logger";

import { NotificationPayload } from "../interfaces/notification.interface";

import { notificationQueue } from "./queues/notification.queue";

class NotificationService {
  async send(payload: NotificationPayload): Promise<void> {
    try {
      await notificationQueue.add(
        "SEND_NOTIFICATION",
        payload,
        {
          priority: payload.priority ?? 1,

          delay: payload.delay ?? 0,
        },
      );

      logger.info("📨 Notification queued", {
        channel: payload.channel,
        to: payload.to,
        template: payload.template,
      });
    } catch (error: any) {
      logger.error("❌ Failed to queue notification", {
        message: error.message,
      });

      throw error;
    }
  }
}

export const notificationService = new NotificationService();