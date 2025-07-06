import { eq } from 'drizzle-orm'
import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'

export default defineEventHandler(async (event) : Promise<TelegramChannelModel[]> => {
  const { userId, db } = event.context

  const channels = await db.query.telegramChannels.findMany({
    columns: {
      id: true,
      userId: true,
      chatId: true,
      isVerified: true
    },

    where: eq(tables.telegramChannels.userId, userId)
  })

  return channels
})
