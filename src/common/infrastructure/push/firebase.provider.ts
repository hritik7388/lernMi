// src/common/infrastructure/push/firebase.provider.ts
import admin from "firebase-admin";

import { env } from "../../../config/env";
import logger from "../../../config/logger";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
 privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    }),
  });

  logger.info("🔥 Firebase Admin initialized");
}

export const firebaseMessaging = admin.messaging();

export default firebaseMessaging;