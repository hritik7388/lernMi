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
exports.AuthService = void 0;
// src/modules/authServices/service.ts
const repository_1 = require("./repository");
const errors_1 = require("../../common/errors");
const bcrypt_helper_1 = require("../../common/helper/bcrypt.helper");
class AuthService {
    constructor() {
        this.repository = new repository_1.AuthRepository();
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emailExists, mobileExists } = yield this.repository.checkUserExists(userData.email, userData.mobileNumber);
            if (emailExists) {
                throw new errors_1.AppError("User with this email already exists", errors_1.HttpStatus.CONFLICT);
            }
            if (mobileExists) {
                throw new errors_1.AppError("User with this mobile number already exists", errors_1.HttpStatus.CONFLICT);
            }
            const passwordHash = yield bcrypt_helper_1.BcryptHelper.hash(userData.passwordHash);
            const { credential, profile } = yield this.repository.createUser(Object.assign(Object.assign({}, userData), { passwordHash: passwordHash }));
            const userRes = {
                cred_id: credential.cred_id,
                email: credential.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                mobileNumber: profile.mobileNumber,
                countryCode: profile.countryCode,
                user_type: profile.user_type,
            };
            return {
                message: "User registered successfully",
                data: userRes,
            };
        });
    }
}
exports.AuthService = AuthService;
