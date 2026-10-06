import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
import { telegramQueryKeys } from '~/composables/keys/telegram'
import { captureQueryUser, isCurrentQueryUser } from '~/utils/query-client'
import { useUserStore } from '~/stores/user'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { $fetch } from 'ofetch'

export function useAddTelegramChannel() {
  const queryClient = useQueryClient()
  const userStore = useUserStore()

  return useMutation({
    mutationFn(chatId: string) {
      return $fetch<TelegramChannelModel>('/api/telegram/channel', {
        method: 'POST',
        body: { chatId }
      })
    },

    onMutate() {
      return captureQueryUser(queryClient, userStore.userId)
    },

    // TanStack passes the saved mutation context as the fourth argument.
    // oxlint-disable-next-line eslint/max-params
    async onSettled(_data, _error, _chatId, context) {
      const isCurrentSession = isCurrentQueryUser(queryClient, context, userStore.userId)

      if (!isCurrentSession) {
        return
      }

      const queryKey = telegramQueryKeys.channels()

      await queryClient.cancelQueries({ queryKey, exact: true })

      const isSessionStillCurrent = isCurrentQueryUser(queryClient, context, userStore.userId)

      if (isSessionStillCurrent) {
        await queryClient.invalidateQueries({ queryKey, exact: true })
      }
    }
  })
}
