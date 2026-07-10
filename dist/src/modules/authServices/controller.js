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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const service_1 = require("./service");
const utils_1 = require("../../common/utils");
class AuthController {
    constructor() {
        this.registerUser = (0, utils_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.registerUser(req.body);
            utils_1.ApiResponse.success(res, 201, result.message, result.data);
        }));
        this.authService = new service_1.AuthService();
    }
}
exports.AuthController = AuthController;
