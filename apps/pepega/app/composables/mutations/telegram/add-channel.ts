import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
import { telegramQueryKeys } from '../../keys/telegram'

export const useAddTelegramChannel = defineMutation(() => {
  const queryCache = useQueryCache()

  return useMutation({
    mutation(chatId: string) {
      return $fetch<TelegramChannelModel>('/api/telegram/channel', {
        method: 'POST',
        body: { chatId }
      })
    },

    async onSettled() {
      const channelsKey = telegramQueryKeys.channels()

      return await queryCache.invalidateQueries({ key: channelsKey })
    }
  })
})
