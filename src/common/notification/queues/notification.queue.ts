// src/common/notification/queues/notification.queue.ts

import { Queue } from "bullmq";

import { redisClient } from "../../../config/redis";
import logger from "../../../config/logger";

export const NOTIFICATION_QUEUE_NAME = "notification-queue";

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection: redisClient as any,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: {
      age: 60 * 60 * 24,
      count: 1000,
    },

    removeOnFail: {
      age: 60 * 60 * 24 * 7,
      count: 5000,
    },
  },
});

notificationQueue.on("error", (error) => {
  logger.error("❌ Notification Queue Error", {
    message: error.message,
  });
});
