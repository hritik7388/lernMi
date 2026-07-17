// src/modules/notification/notification.service.ts

import { NotificationChannel } from "../../common/enums/notification-channel.enum";
import { NotificationTemplate } from "../../common/enums/notification-template.enum";
import { notificationService } from "../../common/notification";
import notificationRepository from "./notification.repository";

class NotificationModuleService {
  async sendPushToUser(
    credId: string,
    subject: string,
    body: string,
    data: Record<string, unknown> = {},
  ): Promise<void> {
    const devices = await notificationRepository.getUserDevices(credId);

    if (!devices.length) {
      return;
    }

    await Promise.all(
      devices.map(({ device_FCM_Id }) =>
        notificationService.send({
          channel: NotificationChannel.PUSH,
          template: NotificationTemplate.GENERAL,
          to: device_FCM_Id,
          subject,
          data: {
            body,
            ...data,
          },
        }),
      ),
    );
  }
}

export default new NotificationModuleService();
