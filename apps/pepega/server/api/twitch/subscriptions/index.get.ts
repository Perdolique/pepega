import { getSubscriptions } from '@pepega/twitch/subscriptions'
import { obtainTwitchAppToken } from '~~/server/utils/twitch/auth'

export default defineEventHandler(async (event) => {
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

    for (const subscription of subscriptions.data) {
      result.push({
        id: subscription.id,
        type: subscription.type,
        broadcasterId: subscription.condition.broadcaster_user_id
      })
    }
  } catch (error) {
    logger.warn('Error fetching subscriptions:', error)
  }

  return result
})
