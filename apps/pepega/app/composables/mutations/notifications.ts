import { defineMutation, useMutation, useQueryCache } from '@pinia/colada';
import { $fetch } from 'ofetch';
import type { NotificationEventType, NotificationModel } from '~~/shared/models/notifications';
import { notificationKeys } from '~/composables/keys/notifications';

/**
 *  Composable to initialize notifications for a specific event type.
 */
const useInitNotifications = defineMutation(() => {
  const cache = useQueryCache();

  const { mutate, ...mutation } = useMutation({
    async mutation(eventType: NotificationEventType) {
      return $fetch<NotificationModel>('/api/notifications', {
        method: 'POST',
        body: { eventType },
      });
    },

    onSuccess(data, eventType) {
      const { id, isActive } = data;

      cache.setQueryData<NotificationModel>(notificationKeys.byEventType(eventType), {
        id,
        isActive,
      });
    },
  });

  function initNotifications(eventType: NotificationEventType) {
    mutate(eventType);
  }

  return {
    initNotifications,
    ...mutation,
  };
});

/**
 * Composable to delete a notification for a specific event type.
 */
const useDeleteNotification = defineMutation(() => {
  const cache = useQueryCache();

  const { mutate, ...mutation } = useMutation({
    async mutation(eventType: NotificationEventType) {
      await $fetch<void>(`/api/notifications/${eventType}`, {
        method: 'DELETE',
      });
    },

    onSuccess(_data, eventType) {
      cache.setQueryData(notificationKeys.byEventType(eventType), undefined);
    },
  });

  function deleteNotification(eventType: NotificationEventType) {
    mutate(eventType);
  }

  return {
    deleteNotification,
    ...mutation,
  };
});

export { useInitNotifications, useDeleteNotification };
