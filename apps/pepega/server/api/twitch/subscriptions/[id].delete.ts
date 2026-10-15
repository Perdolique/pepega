import { parseRouterParams } from '~~/server/utils/request-validation'
import { deleteSubscription } from '@pepega/twitch/subscriptions'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import { obtainTwitchAppToken } from '~~/server/utils/twitch/auth'
import { validateAdmin } from '~~/server/utils/admin'
import { tables } from '~~/server/utils/database'
import { getValidatedEncryptionKey, getValidatedTwitchClientId } from '~~/server/utils/validation'
import { createError, defineEventHandler } from 'nuxt/server'
import logger from '~~/server/utils/logger'

const paramsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.nonEmpty()
  )
})

export default defineEventHandler(async (event) => {
  const { db } = event.context
  const { id: subscriptionId } = parseRouterParams(event, paramsSchema)

  await validateAdmin(event)

  const encryptionKey = getValidatedEncryptionKey()
  const appAccessToken = await obtainTwitchAppToken(encryptionKey)
  const clientId = getValidatedTwitchClientId()

  try {
    logger.info('Deleting subscription on Twitch:', subscriptionId)

    await deleteSubscription({
      clientId,
      token: appAccessToken,
      id: subscriptionId
    })

    try {
      logger.info('Deleting subscription from database:', subscriptionId)

      await db
        .delete(tables.webhooks)
        .where(
          eq(tables.webhooks.subscriptionId, subscriptionId)
        )
    } catch (error) {
      logger.error('Error deleting subscription from database:', error)
    }

    event.res.status = 204

    return null
  } catch (error) {
    logger.error('Error deleting subscription on Twitch:', error)

    throw createError({
      status: 400
    })
  }
})
