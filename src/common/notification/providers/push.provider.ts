// src/common/notification/providers/push.provider.ts
import { firebaseMessaging } from "../../infrastructure/push";
import logger from "../../../config/logger";

export interface PushNotification {
  token: string;

  title: string;

  body: string;

  data?: Record<string, string>;
}

export class PushProvider {
  async send(payload: PushNotification): Promise<void> {
    try {
      const messageId = await firebaseMessaging.send({
        token: payload.token,

        notification: {
          title: payload.title,
          body: payload.body,
        },

        data: payload.data,
      });

      logger.info("📱 Push notification sent", {
        token: payload.token,
        messageId,
      });
    } catch (error: any) {
      logger.error("❌ Push notification failed", {
        token: payload.token,
        message: error.message,
      });

      throw error;
    }
  }
}

export default new PushProvider();
