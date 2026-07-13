// src/common/constant/notification.constants.ts
// src/common/constants/notification.constants.ts

/**
 * Queue Names
 */
export const QUEUE_NAMES = {
  NOTIFICATION: "notification-queue",
} as const;

/**
 * BullMQ Job Names
 */
export const NOTIFICATION_JOB = {
  SEND_NOTIFICATION: "SEND_NOTIFICATION",
} as const;

/**
 * Notification Channels
 */
export const NOTIFICATION_CHANNEL = {
  EMAIL: "EMAIL",
  SMS: "SMS",
  PUSH: "PUSH",
  WHATSAPP: "WHATSAPP",
  IN_APP: "IN_APP",
} as const;

/**
 * Email Templates
 */
export const EMAIL_TEMPLATE = {
  PASSWORD_RESET: "PASSWORD_RESET",
  VERIFY_EMAIL: "VERIFY_EMAIL",
  WELCOME: "WELCOME",
  PASSWORD_RESET_SUCCESS: "PASSWORD_RESET_SUCCESS",
} as const;

/**
 * BullMQ Retry Configuration
 */
export const QUEUE_OPTIONS = {
  ATTEMPTS: 3,

  BACKOFF: {
    TYPE: "exponential",
    DELAY: 3000,
  },

  REMOVE_ON_COMPLETE: 100,

  REMOVE_ON_FAIL: 500,
} as const;

/**
 * Email Configuration
 */
export const EMAIL_CONFIG = {
  OTP_EXPIRY_MINUTES: 3,

  FROM_NAME: "ScaffSnapp",

  SUPPORT_EMAIL: "support@scaffsnapp.com",
} as const;
