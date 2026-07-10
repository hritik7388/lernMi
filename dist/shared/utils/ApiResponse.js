"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, statusCode, message, data) {
        return res.status(statusCode).json({
            success: true,
            statusCode,
            message,
            data,
        });
    }
    static error(res, statusCode, message, error) {
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            error,
        });
    }
}
exports.ApiResponse = ApiResponse;
