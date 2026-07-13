// src/common/utils/graceful-shutdown.ts
import { Server } from "node:http";

import prisma from "../../config/prisma";
import { redisClient } from "../../config/redis";
import logger from "../../config/logger";

let isShuttingDown = false;

export const setupGracefulShutdown = (server: Server) => {
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`🛑 Received ${signal}. Starting graceful shutdown...`);

    const forceTimeout = setTimeout(() => {
      logger.error("Shutdown timeout reached. Forcing exit.");
      process.exit(1);
    }, 15000);

    try {
      // Stop accepting new requests
      await new Promise<void>((resolve) => {
        server.close(() => {
          logger.info("🌐HTTP server closed");
          resolve();
        });
      });

      // Disconnect Prisma
      await prisma.$disconnect();
      logger.info("🗄️ Prisma disconnected");

      // Disconnect Redis
      if (redisClient.status === "ready") {
        await redisClient.quit();
        logger.info("📦 Redis disconnected");
      }

      clearTimeout(forceTimeout);

      logger.info("✅  Graceful shutdown completed.");
      process.exit(0);
    } catch (error: any) {
      logger.error("Error during graceful shutdown", {
        message: error.message,
        stack: error.stack,
      });

      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("uncaughtException", (error: Error) => {
    logger.error("Uncaught Exception", {
      message: error.message,
      stack: error.stack,
    });

    shutdown("uncaughtException");
  });

  process.on('unhandledRejection', (reason: any) => {
        logger.error('Unhandled Rejection', {
            reason,
        });
        shutdown('unhandledRejection');
    });
};