"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const env_1 = require("./env");
const isProduction = process.env.NODE_ENV === "production";
const devFormat = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}] : ${stack || message}`;
}));
const prodFormat = winston_1.default.format.json();
const logger = winston_1.default.createLogger({
    level: env_1.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), isProduction ? prodFormat : devFormat),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new winston_1.default.transports.File({
            filename: "logs/combined.log",
        }),
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: "logs/exceptions.log" }),
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({ filename: "logs/rejections.log" }),
    ],
});
exports.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
exports.default = logger;
