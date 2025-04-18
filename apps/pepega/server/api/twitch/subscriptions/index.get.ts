import { getSubscriptions } from '@pepega/twitch/subscriptions'
import { inArray } from 'drizzle-orm'
import { obtainTwitchAppToken } from '~~/server/utils/twitch/auth'

export default defineEventHandler(async (event) => {
  const { db } = event.context

  await validateAdmin(event)

  const encryptionKey = getValidatedEncryptionKey()
  const appAccessToken = await obtainTwitchAppToken(encryptionKey)
  const clientId = getValidatedTwitchClientId()
  const result = []

  if (appAccessToken === null) {
    logger.error('App access token not found')

    throw createError({
      statusCode: 400
    })
  }

  try {
    const subscriptions = await getSubscriptions({
      token: appAccessToken,
      clientId
    })

    const broadcasterIds = subscriptions.data.map(({ condition }) => condition.broadcaster_user_id)

    const streamers = await db.query.streamers.findMany({
      columns: {
        broadcasterId: true,
        displayName: true,
        login: true
      },

      where: inArray(tables.streamers.broadcasterId, broadcasterIds)
    })

    const streamersList = streamers.map((streamer) => [streamer.broadcasterId, streamer] as const)
    const streamersMap = new Map(streamersList)

    for (const subscription of subscriptions.data) {
      const streamer = streamersMap.get(subscription.condition.broadcaster_user_id)
      const streamerName = streamer?.displayName ?? null
      const streamerLogin = streamer?.login ?? null

      result.push({
        streamerName,
        streamerLogin,
        broadcasterId: subscription.condition.broadcaster_user_id,
        id: subscription.id,
        type: subscription.type
      })
    }
  } catch (error) {
    logger.warn('Error fetching subscriptions:', error)
  }

  return result
})
