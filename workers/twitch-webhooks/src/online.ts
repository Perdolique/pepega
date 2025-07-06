import {
  defineEventHandler,
  EventHandlerRequest,
  H3Event,
  send,
  getHeader,
  createError,
  getHeaders,
  readRawBody,
  sendNoContent,
  readBody
} from 'h3'

import * as v from 'valibot'
import { and, eq, isNotNull, or } from 'drizzle-orm'
import { destr, safeDestr } from 'destr'
import { verifyEventMessage } from '@pepega/twitch/auth'
import { createDrizzle, tables } from '@pepega/database/connection'
import { decrypt } from '@pepega/utils/crypto'
import { getValidatedDebug, getValidatedRequiredEnv, validateEventMessageType, validateEventVerificationHeaders } from './utils/validation'
import { WebhookStatus } from './models/database'
import logger from './logger'
import { streamOnlineNotificationSchema } from './utils/validation/event-sub/notification'
import { EventSubscriptionType, StreamOnlineNotification } from '@pepega/twitch/models/event-sub'
import { sendTelegramNotification } from './utils/telegram'

interface ProcessNotificationParams {
  event: H3Event<EventHandlerRequest>;
  messageId: string;
  messageSignature: string;
  messageTimestamp: string;
  notification: StreamOnlineNotification;
  rawBody: string;
}

const challengeBodySchema = v.pipe(
  v.object({
    challenge: v.string(),

    subscription: v.object({
      id: v.string(),

      condition: v.object({
        broadcaster_user_id: v.string()
      })
    })
  }),

  v.transform((input) => ({
    challenge: input.challenge,
    subscriptionId: input.subscription.id,
    broadcasterId: input.subscription.condition.broadcaster_user_id
  }))
)

function challengeBodyValidator(body: unknown) {
  return v.parse(challengeBodySchema, body)
}

/**
 * Handle the challenge request
 *
 * [Responding to a challenge request](https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#responding-to-a-challenge-request)
 */
async function handleChallengeRequest(event: H3Event<EventHandlerRequest>) {
  const { databaseUrl, localDatabase, encryptionKey } = getValidatedRequiredEnv(event)
  const rawHeaders = getHeaders(event)
  const { messageId, messageSignature, messageTimestamp } = validateEventVerificationHeaders(rawHeaders)
  const rawBody = await readRawBody(event)
  const debugMode = getValidatedDebug(event)

  if (rawBody === undefined) {
    logger.error('Raw body is undefined in the challenge request')

    throw createError({ status: 403 })
  }

  const { challenge, subscriptionId, broadcasterId } = challengeBodyValidator(destr(rawBody))
  const db = createDrizzle(databaseUrl, localDatabase)

  // TODO: Check indexes for this query
  const [webhook] = await db.select({
    id: tables.webhooks.id,
    secretHash: tables.webhooks.secretHash
  })
    .from(tables.webhooks)
    .innerJoin(tables.streamers,
      eq(tables.webhooks.streamerId, tables.streamers.id)
    )
    .where(
      and(
        eq(tables.webhooks.subscriptionId, subscriptionId),
        eq(tables.webhooks.type, 'stream.online' as EventSubscriptionType),
        eq(tables.webhooks.status, 'pending' as WebhookStatus),
        isNotNull(tables.webhooks.secretHash),
        eq(tables.streamers.broadcasterId, broadcasterId)
      )
    )

  if (webhook === undefined || webhook.secretHash === null) {
    if (debugMode) {
      logger.error('Webhook not found or secret is null', {
        subscriptionId,
        broadcasterId
      })
    }

    throw createError({
      status: 404
    })
  }

  const decryptedSecret = await decrypt(webhook.secretHash, encryptionKey)

  // Verify the event message
  const isVerified = await verifyEventMessage({
    bodyString: rawBody,
    messageId,
    messageTimestamp,
    messageSignature,
    secret: decryptedSecret
  })

  if (isVerified === false) {
    throw createError({ status: 403 })
  }

  // Update the webhook status
  await db.update(tables.webhooks)
    .set({
      status: 'active' satisfies WebhookStatus
    })
    .where(
      eq(tables.webhooks.id, webhook.id)
    )

  return send(event, challenge, 'text/plain')
}

async function processNotification({
  event,
  messageId,
  messageSignature,
  messageTimestamp,
  notification,
  rawBody
} : ProcessNotificationParams) {
  const { databaseUrl, localDatabase, encryptionKey } = getValidatedRequiredEnv(event)
  const db = createDrizzle(databaseUrl, localDatabase)
  const eventType : EventSubscriptionType = 'stream.online'

  // Get the webhook secret from the database
  const [webhook] = await db
    .select({
      secretHash: tables.webhooks.secretHash,
      streamerId: tables.webhooks.streamerId
    })
    .from(tables.webhooks)
    .innerJoin(
      tables.streamers,
      eq(tables.webhooks.streamerId, tables.streamers.id)
    )
    .where(
      and(
        eq(tables.webhooks.subscriptionId, notification.subscription.id),
        eq(tables.webhooks.type, eventType),
        eq(tables.streamers.broadcasterId, notification.subscription.condition.broadcaster_user_id)
      )
    )

  if (webhook === undefined || webhook.secretHash === null) {
    logger.error('Webhook not found or secret is null', {
      subscriptionId: notification.subscription.id,
      broadcasterId: notification.subscription.condition.broadcaster_user_id,
    })

    throw createError({
      status: 404,
      statusMessage: 'Webhook not found'
    })
  }

  // Decrypt the webhook secret
  const decryptedSecret = await decrypt(webhook.secretHash, encryptionKey)

  // Validate the event message
  const isVerified = await verifyEventMessage({
    bodyString: rawBody,
    messageId,
    messageTimestamp,
    messageSignature,
    secret: decryptedSecret
  })

  if (isVerified === false) {
    logger.error('Failed to verify the event message', {
      messageId,
      messageTimestamp,
      messageSignature,
      rawBody
    })

    throw createError({
      status: 403,
      statusMessage: 'Invalid event message'
    })
  }

  // Get notification destinations
  const destinations = await db
    .select({
      config: tables.notificationDestinations.config,
      message: tables.notificationDestinations.message,
      telegramChatId: tables.telegramChannels.chatId
    })
    .from(tables.notifications)
    .innerJoin(
      tables.notificationDestinations,
      eq(tables.notificationDestinations.notificationId, tables.notifications.id)
    )
    .leftJoin(
      tables.notificationProviders,
      eq(tables.notificationDestinations.providerId, tables.notificationProviders.id)
    )
    .leftJoin(
      tables.telegramChannels,
      eq(tables.notificationDestinations.telegramChannelId, tables.telegramChannels.id)
    )
    .where(
      and(
        eq(tables.notifications.streamerId, webhook.streamerId),
        eq(tables.notifications.eventType, eventType),
        eq(tables.notifications.isActive, true),
        eq(tables.notificationDestinations.isActive, true),

        // NOTE: Add more providers in the future to this condition
        or(
          and(
            eq(tables.notificationProviders.type, 'telegram'),
            eq(tables.telegramChannels.isVerified, true)
          )
        )
      )
    )

  if (destinations.length === 0) {
    logger.warn('No active notification destinations found for the webhook', {
      streamerId: webhook.streamerId,
      eventType
    })

    throw createError({
      status: 404,
      statusMessage: 'No active notification destinations found'
    })
  }

  // Process each destination
  for (const destination of destinations) {
    // TODO: Move to middleware and set it in the event directly
    const debug = getValidatedDebug(event)

    if (destination.config.type === 'telegram' && destination.telegramChatId !== null) {
      // TODO: Handle errors -> deactivate destination and mark telegram channel as unverified
      await sendTelegramNotification({
        debug,
        chatId: destination.telegramChatId,
        message: destination.message,
        botToken: event.context.cloudflare.env.TELEGRAM_BOT_TOKEN
      })
    }
  }
}

/**
 * Logic of this function:
 *
 * 1. Validate the request.
 * 2. - If the request is valid, return 200 (required by Twitch to respond as soon as possible).
 *    - If the request is invalid, return error back to Twitch (check docs).
 * 3. Process the notification in the background with Cloudflare's `waitUntil()`.
 */
async function handleNotificationRequest(event: H3Event<EventHandlerRequest>) {
  const rawBody = await readRawBody(event)
  const rawHeaders = getHeaders(event)
  let destructuredBody
  let messageId
  let messageSignature
  let messageTimestamp

  // Validate headers
  try {
    const headers = validateEventVerificationHeaders(rawHeaders)

    messageId = headers.messageId
    messageSignature = headers.messageSignature
    messageTimestamp = headers.messageTimestamp
  } catch (error) {
    logger.error('Failed to validate the event verification headers:', error)

    throw createError({
      status: 403,
      statusMessage: 'Invalid event verification headers'
    })
  }

  // Validate the request body
  try {
    if (rawBody === undefined) {
      throw new Error('Raw body is undefined')
    }

    destructuredBody = safeDestr(rawBody)
  } catch (error) {
    logger.error('Failed to parse the notification body:', error)

    throw createError({
      status: 400,
      statusMessage: 'Invalid notification body'
    })
  }

  // Validate the notification body
  try {
    const notification : StreamOnlineNotification = v.parse(streamOnlineNotificationSchema, destructuredBody)

    event.context.cloudflare.ctx.waitUntil(
      processNotification({
        event,
        messageId,
        messageSignature,
        messageTimestamp,
        notification,
        rawBody
      })
    )
  } catch (error) {
    logger.error('Failed to validate the notification body:', error)

    throw createError({
      status: 400,
      statusMessage: 'Invalid notification body'
    })
  }

  sendNoContent(event)
}

async function handleRevocationRequest(event: H3Event<EventHandlerRequest>) {
  const headers = getHeaders(event)
  const body = await readBody(event)

  // TODO: Implement the revocation request handling
  logger.warn('Revocation request received, but not implemented yet', {
    headers,
    body
  })

  return sendNoContent(event)
}

export default defineEventHandler(async (event) => {
  const messageTypeHeader = getHeader(event, 'twitch-eventsub-message-type')
  const messageType = validateEventMessageType(messageTypeHeader)

  if (messageType === 'notification') {
    return await handleNotificationRequest(event)
  }

  if (messageType === 'webhook_callback_verification') {
    return await handleChallengeRequest(event)
  }

  if (messageType === 'revocation') {
    return await handleRevocationRequest(event)
  }
})
