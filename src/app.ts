// src/app.ts
import "reflect-metadata";
import "dotenv/config";

import dotenv from "dotenv";
dotenv.config();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
import routes from "./routes";
import express from "express";
import morgan from "morgan";
import path from "node:path";

import "./common/notification/workers/notification.worker";

import prisma from "./config/prisma";
import { redisClient } from "./config/redis";
import logger from "./config/logger";

import { setupGracefulShutdown } from "./common/utils/graceful-shutdown";
import { errorMiddleware } from "./common/middleware/error.middleware";
import { notFoundMiddleware } from "./common/middleware";
import corsMiddleware from "./common/middleware/cors.middleware";
import { env } from "./config/env";

const app = express();
app.disable("x-powered-by");
const PORT = env.PORT || 3000;

// Middlewares
app.use(morgan("dev"));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static(path.join(__dirname, ".well-known")));

// Routes
app.use("/api/v1", routes);

// Error Middleware (Always Last)
app.use(errorMiddleware);
app.use(notFoundMiddleware);

async function bootstrap() {
  try {
    // Prisma
    await prisma.$connect();
    logger.info("🗄️ ✅ Prisma connected successfully");

    // Redis
    if (redisClient.status !== "ready") {
      await redisClient.connect();
      logger.info("📦 ✅ Redis connected successfully");
    }

    // HTTP Server
    const server = app.listen(PORT, () => {
      logger.info(`🌐 🚀 Server is running at http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    setupGracefulShutdown(server);
    logger.info("🎉 Application started successfully");
  } catch (error: any) {
    logger.error("Application startup failed", {
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
}

bootstrap();

export default app;
