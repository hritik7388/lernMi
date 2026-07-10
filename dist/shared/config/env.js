"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RequiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value;
};
exports.env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 3001,
    DATABASE_URL: RequiredEnv("DATABASE_URL"),
    REDIS_URL: RequiredEnv("REDIS_URL"),
    JWT_REFRESH_SECRET: RequiredEnv("JWT_REFRESH_SECRET"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:3000",
};
