import { queryOptions } from '@tanstack/vue-query'
import { telegramQueryKeys } from '~/composables/keys/telegram'
import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
import { $fetch } from 'ofetch'

export function getTelegramChannels() {
  return queryOptions({
    queryKey: telegramQueryKeys.channels(),
    enabled: import.meta.client,

    queryFn({ signal }) {
      return $fetch<TelegramChannelModel[]>('/api/telegram/channel', {
        method: 'GET',
        signal
      })
    }
  })
}
