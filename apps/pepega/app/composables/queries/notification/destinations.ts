import { defineQueryOptions } from '@pinia/colada';
import { $fetch } from 'ofetch';
import { destinationKeys } from '~/composables/keys/notification/destinations';
import type { NotificationDestinationModel } from '~~/shared/models/notifications';

export const getByNotificationId = defineQueryOptions((notificationId: number) => {
  return {
    key: destinationKeys.byNotificationId(notificationId),
    enabled: import.meta.client,

    async query() {
      return $fetch<NotificationDestinationModel[]>('/api/notifications/destinations', {
        method: 'GET',

        query: {
          notificationId,
        },
      });
    },
  };
});
