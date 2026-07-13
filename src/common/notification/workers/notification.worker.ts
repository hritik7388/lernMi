// src/common/notification/workers/notification.worker.ts
import { Worker, Job } from "bullmq";

import logger from "../../../config/logger";
import { env } from "../../../config/env";

import dispatcher from "../dispatcher";
import { NOTIFICATION_QUEUE_NAME } from "../queues/notification.queue"; 
import { NotificationPayload } from "../notification.service";

const redisUrl = new URL(env.REDIS_URL);
const workerConnection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port) || 6379,
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
};

export const notificationWorker = new Worker<NotificationPayload>(
  NOTIFICATION_QUEUE_NAME,

  async (job: Job<NotificationPayload>) => {
    logger.info("📥 Processing notification", {
      jobId: job.id,
      channel: job.data.channel,
      recipient: job.data.recipient,
      template: job.data.template,
      attemptsMade: job.attemptsMade,
    });

    try {
      await dispatcher.dispatch(job.data);

      logger.info("✅ Notification processed", {
        jobId: job.id,
      });
    } catch (error: any) {
      logger.error("❌ Notification failed", {
        jobId: job.id,
        message: error.message,
        stack: error.stack,
      });

      throw error;
    }
  },

  {
    connection: workerConnection,

    concurrency: 10,

    autorun: true,
  }
);

notificationWorker.on("completed", (job) => {
  logger.info("🎉 Job completed", {
    jobId: job.id,
  });
});

notificationWorker.on("failed", (job, error) => {
  logger.error("💥 Job failed", {
    jobId: job?.id,
    message: error.message,
  });
});

notificationWorker.on("active", (job) => {
  logger.info("⚡ Job started", {
    jobId: job.id,
  });
});

notificationWorker.on("ready", () => {
  logger.info("🚀 Notification worker ready");
});

notificationWorker.on("error", (error) => {
  logger.error("❌ Worker error", {
    message: error.message,
  });
});

notificationWorker.on("closing", () => {
  logger.warn("🛑 Notification worker shutting down");
});