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
import cors from "cors";
import morgan from "morgan";
import path from "path";

import prisma from "./config/prisma";
import { redisClient } from "./config/redis";
import logger from "./config/logger";

import { setupGracefulShutdown } from "./common/utils/graceful-shutdown";
import { errorMiddleware } from "./common/middleware/error.middleware";
import { notFoundMiddleware } from "./common/middleware";
import corsMiddleware from "./common/middleware/cors.middleware";
import {env} from "./config/env";

const app = express();
const PORT =  env.PORT || 3000;

// Middlewares
app.use(cors());
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
    logger.info("✅ Prisma connected");

    // Redis
    if (redisClient.status !== "ready") {
      await redisClient.connect();
      logger.info("✅ Redis connected");
    }

    // HTTP Server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    setupGracefulShutdown(server);
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
