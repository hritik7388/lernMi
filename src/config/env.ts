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
  SMTP_HOST:  string,

SMTP_PORT: string,

SMTP_USER: string,

SMTP_PASS: string,

SMTP_FROM:string,

FIREBASE_PROJECT_ID:string,
FIREBASE_CLIENT_EMAIL:string,
FIREBASE_PRIVATE_KEY:string,
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

  SMTP_HOST: RequiredEnv("SMTP_HOST"),

  SMTP_PORT: RequiredEnv("SMTP_PORT"),  

  SMTP_USER: RequiredEnv("SMTP_USER"),

  SMTP_PASS: RequiredEnv("SMTP_PASS"),

  SMTP_FROM: RequiredEnv("SMTP_FROM"),

  FIREBASE_PROJECT_ID: RequiredEnv("FIREBASE_PROJECT_ID"),

  FIREBASE_CLIENT_EMAIL: RequiredEnv("FIREBASE_CLIENT_EMAIL"),

  FIREBASE_PRIVATE_KEY: RequiredEnv("FIREBASE_PRIVATE_KEY"),


};
