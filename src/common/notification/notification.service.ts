// src/common/notification/notification.service.ts

import { notificationQueue } from "./queues/notification.queue";
import logger from "../../config/logger";

export interface NotificationPayload {
  channel: "EMAIL" | "SMS" | "PUSH";

  template: string;

  recipient: string;

  subject?: string;

  data: Record<string, unknown>;

  priority?: number;

  delay?: number;
}

class NotificationService {
  async send(payload: NotificationPayload): Promise<void> {
    try {
      await notificationQueue.add(
        "SEND_NOTIFICATION",
        payload,
        {
          priority: payload.priority ?? 1,

          delay: payload.delay ?? 0,

          removeOnComplete: 1000,

          removeOnFail: 500,

          attempts: 3,

          backoff: {
            type: "exponential",
            delay: 5000,
          },
        }
      );

      logger.info("📨 Notification queued", {
        channel: payload.channel,
        recipient: payload.recipient,
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