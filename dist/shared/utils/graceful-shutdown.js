"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGracefulShutdown = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const redis_1 = require("../config/redis");
const logger_1 = __importDefault(require("../config/logger"));
let isShuttingDown = false;
const setupGracefulShutdown = (server) => {
    const shutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
        if (isShuttingDown)
            return;
        isShuttingDown = true;
        logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
        const forceTimeout = setTimeout(() => {
            logger_1.default.error("Shutdown timeout reached. Forcing exit.");
            process.exit(1);
        }, 15000);
        try {
            // Stop accepting new requests
            yield new Promise((resolve) => {
                server.close(() => {
                    logger_1.default.info("HTTP server closed");
                    resolve();
                });
            });
            // Disconnect Prisma
            yield prisma_1.default.$disconnect();
            logger_1.default.info("Prisma disconnected");
            // Disconnect Redis
            if (redis_1.redisClient.status === "ready") {
                yield redis_1.redisClient.quit();
                logger_1.default.info("Redis disconnected");
            }
            clearTimeout(forceTimeout);
            logger_1.default.info("Graceful shutdown completed.");
            process.exit(0);
        }
        catch (error) {
            logger_1.default.error("Error during graceful shutdown", {
                message: error.message,
                stack: error.stack,
            });
            process.exit(1);
        }
    });
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("uncaughtException", (error) => {
        logger_1.default.error("Uncaught Exception", {
            message: error.message,
            stack: error.stack,
        });
        shutdown("uncaughtException");
    });
    process.on("unhandledRejection", (reason) => {
        logger_1.default.error("Unhandled Rejection", {
            reason,
        });
        shutdown("unhandledRejection");
    });
};
exports.setupGracefulShutdown = setupGracefulShutdown;
