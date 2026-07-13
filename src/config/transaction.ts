// src/config/transaction.ts
import prisma from "./prisma";

export class Transaction {
  static async execute<T>(
    callback: Parameters<typeof prisma.$transaction>[0],
  ): Promise<T> {
    return prisma.$transaction(callback) as Promise<T>;
  }
}
