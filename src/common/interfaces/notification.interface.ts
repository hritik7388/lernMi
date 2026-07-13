// src/common/interfaces/notification.interface.ts
// src/common/interfaces/notification.interface.ts

import { NotificationChannel } from "../enums/notification-channel.enum";
import { NotificationTemplate } from "../enums/notification-template.enum";

export interface NotificationPayload {
  channel: NotificationChannel;

  template: NotificationTemplate;

  to: string;

  subject?: string;

  data: Record<string, unknown>;
}