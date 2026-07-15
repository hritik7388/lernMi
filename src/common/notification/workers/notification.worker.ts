// src/common/notification/workers/notification.worker.ts

import { Worker, Job } from "bullmq";

import logger from "../../../config/logger";
import { env } from "../../../config/env";

import dispatcher from "../dispatcher";

import { NOTIFICATION_QUEUE_NAME } from "../queues/notification.queue";

import { NotificationPayload } from "../../interfaces/notification.interface";

const redisUrl = new URL(env.REDIS_URL);

const workerConnection = {
  host: redisUrl.hostname,

  port: Number(redisUrl.port),

  username: redisUrl.username || undefined,

  password: redisUrl.password || undefined,

  maxRetriesPerRequest: null,
};

export const notificationWorker =
  new Worker<NotificationPayload>(
    NOTIFICATION_QUEUE_NAME,

    async (job: Job<NotificationPayload>) => {
      logger.info("⚡ Processing Notification", {
        jobId: job.id,
      });

      await dispatcher.dispatch(job.data);
    },

    {
      connection: workerConnection,

      concurrency: 10,
    },
  );

notificationWorker.on("completed", (job) => {
  logger.info("✅ Notification Completed", {
    jobId: job.id,
  });
});

notificationWorker.on("failed", (job, error) => {
  logger.error("❌ Notification Failed", {
    jobId: job?.id,

    message: error.message,
  });
});

notificationWorker.on("error", (error) => {
  logger.error("❌ Worker Error", {
    message: error.message,
  });
});