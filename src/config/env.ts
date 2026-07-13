// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

const RequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
};

interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: number | string;
  LOG_LEVEL: string;
  ALLOWED_ORIGINS: string;
  BCRYPT_ROUNDS: number;
}

export const env: Config = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 3001,

  DATABASE_URL: RequiredEnv("DATABASE_URL"),

  REDIS_URL: RequiredEnv("REDIS_URL"),

  JWT_REFRESH_SECRET: RequiredEnv("JWT_REFRESH_SECRET"),

  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:3000",

  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) || 10,
};
