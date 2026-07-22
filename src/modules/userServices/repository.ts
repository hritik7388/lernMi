// src/modules/userServices/repository.ts

import { UserType } from "@prisma/client";
import { CreateUserInput } from "./validator";
import prisma from "../../config/prisma";

export class UserRepository {
  async createUser(data: CreateUserInput) {
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
}
