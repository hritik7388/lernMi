// src/modules/authServices/repository.ts
import {
  DeviceSession,
  Prisma,
  UserCredentials,
  UserProfile,
  UserType,
} from "@prisma/client";

import prisma from "../../config/prisma";
import { RegisterUserInput } from "./validator";

export class AuthRepository {
  async checkUserExists(email: string, mobileNumber: string) {
    const [emailExists, mobileExists] = await Promise.all([
      prisma.userCredentials.findUnique({
        where: { email },
        select: {
          cred_id: true,
          email: true,
        },
      }),

      prisma.userProfile.findUnique({
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
  }
  async findUserByEmail(email: string): Promise<UserCredentials | null> {
    return prisma.userCredentials.findUnique({
      where: {
        email,
      },
    });
  }
  async checkUserActive(credId: string): Promise<UserProfile | null> {
    return prisma.userProfile.findUnique({
      where: {
        cred_id: credId,
        isDeleted: false,
        isVerified: true,
        status: "ACTIVE",
      },
    });
  }

  async incrementFailedLoginAttempts(credId: string) {
    return prisma.userCredentials.update({
      where: {
        cred_id: credId,
      },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    });
  }
  async updateLoginSuccess(credId: string) {
    return prisma.userCredentials.update({
      where: {
        cred_id: credId,
      },
      data: {
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });
  }

  async findDeviceSessionById(
    sessionId: string,
  ): Promise<DeviceSession | null> {
    return prisma.deviceSession.findUnique({
      where: {
        session_id: sessionId,
      },
    });
  }

  async createUser(data: RegisterUserInput) {
    return prisma.$transaction(async (tx) => {
      const credential = await tx.userCredentials.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash!,
        },
      });

      const profile = await tx.userProfile.create({
        data: {
          cred_id: credential.cred_id,
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
          countryCode: data.countryCode,
          user_type: UserType[data.user_type as keyof typeof UserType],
        },
      });

      return { credential, profile };
    });
  }

  async updateUserProfile(
    userId: string,
    data: Prisma.UserProfileUpdateInput,
  ): Promise<UserProfile> {
    return prisma.userProfile.update({
      where: {
        user_id: userId,
      },
      data,
    });
  }

  async createDeviceSession(
    data: Prisma.DeviceSessionCreateInput,
  ): Promise<DeviceSession> {
    return prisma.deviceSession.create({
      data,
    });
  }

  async getUserProfile(credId: string): Promise<UserProfile | null> {
    return prisma.userProfile.findUnique({
      where: {
        cred_id: credId,
      },
    });
  }
}
