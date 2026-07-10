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
// src/app.ts
require("reflect-metadata");
require("dotenv/config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const routes_1 = __importDefault(require("./routes"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("./config/prisma"));
const redis_1 = require("./config/redis");
const logger_1 = __importDefault(require("./config/logger"));
const graceful_shutdown_1 = require("./common/utils/graceful-shutdown");
const error_middleware_1 = require("./common/middleware/error.middleware");
const middleware_1 = require("./common/middleware");
const cors_middleware_1 = __importDefault(require("./common/middleware/cors.middleware"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3001;
// Middlewares
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(cors_middleware_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use(express_1.default.static(path_1.default.join(__dirname, ".well-known")));
// Routes
app.use("/api/v1", routes_1.default);
// Error Middleware (Always Last)
app.use(error_middleware_1.errorMiddleware);
app.use(middleware_1.notFoundMiddleware);
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Prisma
            yield prisma_1.default.$connect();
            logger_1.default.info("✅ Prisma connected");
            // Redis
            if (redis_1.redisClient.status !== "ready") {
                yield redis_1.redisClient.connect();
                logger_1.default.info("✅ Redis connected");
            }
            // HTTP Server
            const server = app.listen(PORT, () => {
                logger_1.default.info(`🚀 Server running on http://localhost:${PORT}`);
            });
            // Graceful Shutdown
            (0, graceful_shutdown_1.setupGracefulShutdown)(server);
        }
        catch (error) {
            logger_1.default.error("Application startup failed", {
                message: error.message,
                stack: error.stack,
            });
            process.exit(1);
        }
    });
}
bootstrap();
exports.default = app;
