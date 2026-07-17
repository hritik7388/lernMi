// src/common/notification/providers/push.provider.ts

import logger from "../../../config/logger";
import firebaseMessaging from "../../infrastructure/push/firebase.provider";

export interface PushNotification {
  token: string;

  title: string;

  body: string;

  imageUrl?: string;

  data?: Record<string, string>;
}

class PushProvider {
  async send(payload: PushNotification): Promise<void> {
    try {
      const response = await firebaseMessaging.send({
        token: payload.token,

        notification: {
          title: payload.title,

          body: payload.body,

          imageUrl: payload.imageUrl,
        },

        android: {
          priority: "high",

          notification: {
            sound: "default",

            channelId: "default",
          },
        },

        apns: {
          payload: {
            aps: {
              sound: "default",
            },
          },
        },

        data: payload.data,
      });

      logger.info("📲 Push sent", {
        token: payload.token,
        messageId: response,
      });
    } catch (error: any) {
      logger.error("❌ Push failed", {
        token: payload.token,
        message: error.message,
      });

      throw error;
    }
  }

  async sendMulticast(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!tokens.length) return;

    const response = await firebaseMessaging.sendEachForMulticast({
      tokens,

      notification: {
        title,

        body,
      },

      data,
    });

    logger.info("📲 Multicast Push", {
      success: response.successCount,
      failed: response.failureCount,
    });
  }
}

export default new PushProvider();
