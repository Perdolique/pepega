import { eq } from 'drizzle-orm'
import type { TelegramChannelModel, TelegramChannelStatus } from '~~/shared/models/telegram-channels'

function transformChannelStatus(status: string) : TelegramChannelStatus {
  switch (status) {
    case 'not_verified': {
      return 'not_verified'
    }

    case 'pending': {
      return 'pending'
    }

    case 'verified': {
      return 'verified'
    }

    case 'failed': {
      return 'failed'
    }

    default: {
      return 'unknown'
    }
  }
}

export default defineEventHandler(async (event) : Promise<TelegramChannelModel[]> => {
  const { userId, db } = event.context

  const channels = await db.query.telegramChannels.findMany({
    columns: {
      id: true,
      userId: true,
      chatId: true,
      status: true
    },

    where: eq(tables.telegramChannels.userId, userId)
  })

  const result = []

  // Transform statuses
  for (const channel of channels) {
    const channelStatus = transformChannelStatus(channel.status)

    result.push({
      id: channel.id,
      chatId: channel.chatId,
      status: channelStatus,
      userId: channel.userId
    })
  }

  return result
})
