"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const errors_1 = require("../errors");
const logger_1 = __importDefault(require("../../config/logger"));
const errorMiddleware = (error, req, res, next) => {
    var _a;
    logger_1.default.error(error);
    if (error instanceof errors_1.AppError) {
        return res.status(error.statusCode).json({
            success: false,
            statusCode: error.statusCode,
            message: error.message,
            errorCode: error.errorCode,
            details: (_a = error.details) !== null && _a !== void 0 ? _a : null,
        });
    }
    if (error instanceof zod_1.ZodError) {
        return res.status(errors_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: errors_1.HttpStatus.BAD_REQUEST,
            message: "Validation failed",
            errors: error.flatten(),
        });
    }
    return res.status(errors_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: errors_1.HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
    });
};
exports.errorMiddleware = errorMiddleware;
