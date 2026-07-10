"use strict";
// common/middleware/validate.middleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiResponse_1 = require("../utils/ApiResponse");
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            ApiResponse_1.ApiResponse.error(res, 400, "Validation failed", errors);
            return;
        }
        next(error);
    }
};
exports.validate = validate;
