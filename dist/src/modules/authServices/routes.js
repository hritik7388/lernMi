"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/authServices/routes.ts
const express_1 = require("express");
const controller_1 = require("./controller");
const validator_1 = require("./validator");
const middleware_1 = require("../../common/middleware");
const authRouter = (0, express_1.Router)();
const authController = new controller_1.AuthController();
authRouter.post("/register", (0, middleware_1.validate)(validator_1.registerSchema), authController.registerUser);
exports.default = authRouter;
