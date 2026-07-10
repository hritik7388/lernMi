"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
exports.redisClient = new ioredis_1.default(env_1.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        logger_1.default.warn(`Redis reconnect attempt #${times}, retrying in ${delay}ms`);
        return delay;
    },
    reconnectOnError(err) {
        logger_1.default.error("Redis reconnectOnError triggered", { message: err.message });
        return true;
    },
    connectTimeout: 10000,
});
exports.redisClient.on("connect", () => {
    logger_1.default.info("Redis connection established");
});
exports.redisClient.on("ready", () => {
    logger_1.default.info("Redis ready to use");
});
exports.redisClient.on("error", (error) => {
    logger_1.default.error("Redis connection error", { message: error.message });
});
exports.redisClient.on("close", () => {
    logger_1.default.warn("Redis connection closed");
});
exports.redisClient.on("end", () => {
    logger_1.default.warn("Redis connection ended");
});
