import type { NotificationDestinationModel } from '~~/shared/models/notifications'
import { replaceTelegramDestination } from '../destinations'
import { describe, expect, it } from 'vitest'

function createDestination(
  id: number,
  message: string,
  telegramChannelId: number
) : NotificationDestinationModel {
  return {
    id,
    config: { type: 'telegram' },
    isActive: true,
    message,
    telegramChannelId
  }
}

describe('telegram destination cache', () => {
  it('keeps one Telegram destination after a repeated save', () => {
    const existingDestination = createDestination(7, 'Old message', 2)
    const savedDestination = createDestination(7, 'New message', 3)
    const destinations = replaceTelegramDestination(
      [existingDestination],
      savedDestination
    )

    expect(destinations).toStrictEqual([savedDestination])
  })
})
