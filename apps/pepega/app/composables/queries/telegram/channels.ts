import { defineQueryOptions } from '@pinia/colada'
import { telegramQueryKeys } from '../../keys/telegram'
import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'

export const getTelegramChannels = defineQueryOptions({
  key: telegramQueryKeys.channels(),
  enabled: import.meta.client,

  query() {
    return $fetch<TelegramChannelModel[]>('/api/telegram/channel', {
      method: 'GET'
    })
  }
})
