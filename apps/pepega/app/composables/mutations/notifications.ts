import type { NotificationEventType, NotificationModel } from '~~/shared/models/notifications'
import { notificationKeys } from '~/composables/keys/notifications'
import { destinationKeys } from '~/composables/keys/notification/destinations'
import { captureQueryUser, isCurrentQueryUser } from '~/utils/query-client'
import { useUserStore } from '~/stores/user'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { $fetch } from 'ofetch'

export function useInitNotifications() {
  const queryClient = useQueryClient()
  const userStore = useUserStore()

  const { mutate: initNotifications, ...mutation } = useMutation({
    mutationFn(eventType: NotificationEventType) {
      return $fetch<NotificationModel>('/api/notifications', {
        method: 'POST',
        body: { eventType }
      })
    },

    onMutate() {
      return captureQueryUser(queryClient, userStore.userId)
    },

    async onSuccess(data, eventType, context) {
      const isCurrentSession = isCurrentQueryUser(queryClient, context, userStore.userId)

      if (!isCurrentSession) {
        return
      }

      const queryKey = notificationKeys.byEventType(eventType)

      await queryClient.cancelQueries({ queryKey, exact: true })

      const isSessionStillCurrent = isCurrentQueryUser(queryClient, context, userStore.userId)

      if (isSessionStillCurrent) {
        queryClient.setQueryData<NotificationModel | null>(queryKey, data)
      }
    }
  })

  return { initNotifications, ...mutation }
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  const userStore = useUserStore()

  const { mutate: deleteNotification, ...mutation } = useMutation({
    mutationFn(eventType: NotificationEventType) {
      return $fetch<void>(`/api/notifications/${eventType}`, {
        method: 'DELETE'
      })
    },

    onMutate(eventType) {
      const userContext = captureQueryUser(queryClient, userStore.userId)
      const queryKey = notificationKeys.byEventType(eventType)
      const notification = queryClient.getQueryData<NotificationModel | null>(queryKey)

      return {
        userId: userContext.userId,
        session: userContext.session,
        notificationId: notification?.id
      }
    },

    async onSuccess(_data, eventType, context) {
      const isCurrentSession = isCurrentQueryUser(queryClient, context, userStore.userId)

      if (!isCurrentSession) {
        return
      }

      const queryKey = notificationKeys.byEventType(eventType)
      const currentNotification = queryClient.getQueryData<NotificationModel | null>(queryKey)
      const currentNotificationId = currentNotification?.id
      const canClearNotification = currentNotificationId === undefined || currentNotificationId === context?.notificationId

      if (canClearNotification) {
        await queryClient.cancelQueries({ queryKey, exact: true })

        const isSessionStillCurrent = isCurrentQueryUser(queryClient, context, userStore.userId)

        if (!isSessionStillCurrent) {
          return
        }

        queryClient.setQueryData<NotificationModel | null>(queryKey, (latestNotification) => {
          const latestNotificationId = latestNotification?.id
          const isNewNotification = latestNotificationId !== undefined && latestNotificationId !== context?.notificationId

          return isNewNotification ? latestNotification : null
        })
      }

      if (context?.notificationId !== undefined) {
        const destinationsQueryKey = destinationKeys.byNotificationId(context.notificationId)

        queryClient.removeQueries({ queryKey: destinationsQueryKey, exact: true })
      }
    }
  })

  return { deleteNotification, ...mutation }
}
