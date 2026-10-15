import { parseRouterParams } from '~~/server/utils/request-validation'
import { deleteSubscription } from '@pepega/twitch/subscriptions'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import { obtainTwitchAppToken } from '~~/server/utils/twitch/auth'
import { getValidatedEncryptionKey, getValidatedTwitchClientId, stringToIntegerSchema } from '~~/server/utils/validation'
import { validateAdmin } from '~~/server/utils/admin'
import { tables } from '~~/server/utils/database'
import { createError, defineEventHandler } from 'nuxt/server'
import logger from '~~/server/utils/logger'

const paramsSchema = v.object({
  id: stringToIntegerSchema
})

export default defineEventHandler(async (event) => {
  const { db } = event.context
  const { id: webhookId } = parseRouterParams(event, paramsSchema)

  await validateAdmin(event)

  const deleted = await db
    .delete(tables.webhooks)
    .where(
      eq(tables.webhooks.id, webhookId)
    )
    .returning({
      id: tables.webhooks.id,
      subscriptionId: tables.webhooks.subscriptionId
    })

  if (deleted.length === 0) {
    throw createError({
      status: 404
    })
  }

  try {
    const encryptionKey = getValidatedEncryptionKey()
    const appAccessToken = await obtainTwitchAppToken(encryptionKey)
    const clientId = getValidatedTwitchClientId()

    for (const { subscriptionId } of deleted) {
      if (subscriptionId !== null) {
        logger.info('Deleting subscription on Twitch:', subscriptionId)

        try {
          await deleteSubscription({
            clientId,
            token: appAccessToken,
            id: subscriptionId
          })
        } catch (error) {
          logger.warn('Error deleting subscription on Twitch:', error)
        }
      }
    }
  } catch (error) {
    logger.warn('Error deleting subscription on Twitch:', error)
  }

  event.res.status = 204

  return null
})
