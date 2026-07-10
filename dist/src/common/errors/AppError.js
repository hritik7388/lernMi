"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// src/common/errors/AppError.ts
const Http_Status_1 = require("./Http-Status");
class AppError extends Error {
    constructor(message, statusCode = Http_Status_1.HttpStatus.INTERNAL_SERVER_ERROR, errorCode = "INTERNAL_SERVER_ERROR", isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
