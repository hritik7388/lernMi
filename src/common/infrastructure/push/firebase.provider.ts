import admin from "firebase-admin";

import { env } from "../../../config/env";
import logger from "../../../config/logger";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replaceAll("\\n", "\n"),
    }),
  });

  logger.info("🔥 Firebase Admin initialized");
}

export const firebaseMessaging = admin.messaging();

export default firebaseMessaging;