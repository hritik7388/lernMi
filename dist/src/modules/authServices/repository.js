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
exports.AuthRepository = void 0;
// src/modules/authServices/repository.ts
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
class AuthRepository {
    checkUserExists(email, mobileNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const [emailExists, mobileExists] = yield Promise.all([
                prisma_1.default.userCredentials.findUnique({
                    where: { email },
                    select: {
                        cred_id: true,
                        email: true,
                    },
                }),
                prisma_1.default.userProfile.findUnique({
                    where: { mobileNumber },
                    select: {
                        user_id: true,
                        mobileNumber: true,
                    },
                }),
            ]);
            return {
                emailExists,
                mobileExists,
            };
        });
    }
    findDeviceSessionById(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.deviceSession.findUnique({
                where: {
                    session_id: sessionId,
                },
            });
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const credential = yield tx.userCredentials.create({
                    data: {
                        email: data.email,
                        passwordHash: data.passwordHash,
                    },
                });
                const profile = yield tx.userProfile.create({
                    data: {
                        cred_id: credential.cred_id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        mobileNumber: data.mobileNumber,
                        countryCode: data.countryCode,
                        user_type: client_1.UserType[data.user_type],
                    },
                });
                return { credential, profile };
            }));
        });
    }
    updateUserProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.userProfile.update({
                where: {
                    user_id: userId,
                },
                data,
            });
        });
    }
    createDeviceSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.deviceSession.create({
                data,
            });
        });
    }
}
exports.AuthRepository = AuthRepository;
