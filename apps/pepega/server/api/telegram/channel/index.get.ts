import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) : Promise<TelegramChannelModel[]> => {
  const { userId, db } = event.context

  const channels = await db.query.telegramChannels.findMany({
    columns: {
      id: true,
      userId: true,
      chatId: true,
      isVerified: true
    },

    where: {
      userId
    }
  })

  return channels
})
