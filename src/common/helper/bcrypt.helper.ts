// src/common/helper/bcrypt.helper.ts
import bcrypt from "bcrypt";
import { env } from "../../config/env";
export class BcryptHelper {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, env.BCRYPT_ROUNDS);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
