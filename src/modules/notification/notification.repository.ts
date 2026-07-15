// src/modules/notification/notification.repository.ts
// src/modules/notification/notification.repository.ts

import prisma from "../../config/prisma";

class NotificationRepository {
  async getUserDevices(credId: string) {
    return prisma.deviceSession.findMany({
      where: {
        cred_id: credId,
      },

      select: {
        session_id: true,
        device_FCM_Id: true,
        deviceName: true,
        deviceType: true,
      },
    });
  }

  async removeDevice(sessionId: string) {
    return prisma.deviceSession.delete({
      where: {
        session_id: sessionId,
      },
    });
  }

  async updateFCMToken(
    sessionId: string,
    token: string,
  ) {
    return prisma.deviceSession.update({
      where: {
        session_id: sessionId,
      },

      data: {
        device_FCM_Id: token,
      },
    });
  }
}

export default new NotificationRepository();