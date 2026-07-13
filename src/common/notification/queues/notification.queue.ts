// src/common/notification/queues/notification.queue.ts
// src/notification/queues/notification.queue.ts

import { Queue, JobsOptions } from "bullmq";

import { redisClient } from "../../../config/redis";
import logger from "../../../config/logger";

export const NOTIFICATION_QUEUE_NAME = "notification-queue";

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  // cast to any to avoid ioredis type mismatch between installed copies
  connection: redisClient as any,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: {
      age: 60 * 60 * 24, // 24 Hours

      count: 1000,
    },

    removeOnFail: {
      age: 60 * 60 * 24 * 7, // 7 Days

      count: 5000,
    },
  },
});

notificationQueue.on("error", (error) => {
  logger.error("❌ Notification Queue Error", {
    message: error.message,
  });
});

notificationQueue.on("waiting", (job) => {
  logger.info("📥 Notification queued", {
    jobId: job,
  });
});

notificationQueue.on("paused", () => {
  logger.warn("⏸ Notification Queue paused");
});

notificationQueue.on("resumed", () => {
  logger.info("▶ Notification Queue resumed");
});

export async function addNotificationJob(
  name: string,
  payload: unknown,
  options?: JobsOptions,
) {
  return notificationQueue.add(name, payload, options);
}
