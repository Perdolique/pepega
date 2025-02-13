import { defineEventHandler, EventHandlerRequest, H3Event, readValidatedBody, send, getHeader, createError, getHeaders, readRawBody } from 'h3'
import * as v from 'valibot'
import { and, desc, eq, isNotNull } from 'drizzle-orm'
import { destr } from 'destr'
import { verifyEventMessage } from '@pepega/twitch'
import { createDrizzle, tables } from '@pepega/database/connection'
import { decrypt } from '@pepega/utils/crypto'
import { getValidatedEnv, validateTwitchEventSubMessageType, validateTwitchEventSubVerificationHeaders } from './utils/validation'
import { EventSubSubscriptionType } from './models/twitch'
import { WebhookStatus } from './models/database'

// TODO: move to models
// {
//   "challenge": "pogchamp-kappa-360noscope-vohiyo",
//   "subscription": {
//     "id": "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
//     "status": "webhook_callback_verification_pending",
//     "type": "channel.follow",
//     "version": "1",
//     "cost": 1,
//     "condition": {
//       "broadcaster_user_id": "12826"
//     },
//     "transport": {
//       "method": "webhook",
//       "callback": "https://example.com/webhooks/callback"
//     },
//     "created_at": "2019-11-16T10:11:12.634234626Z"
//   }
// }
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
  const { databaseUrl, localDatabase, encryptionKey } = getValidatedEnv(event.context.cloudflare.env)
  const rawHeaders = getHeaders(event)
  const { messageId, messageSignature, messageTimestamp } = validateTwitchEventSubVerificationHeaders(rawHeaders)
  const rawBody = await readRawBody(event)

  if (rawBody === undefined) {
    throw createError({ status: 403 })
  }

  const { challenge, subscriptionId, broadcasterId } = challengeBodyValidator(destr(rawBody))
  const db = createDrizzle(databaseUrl, localDatabase)

  const [webhook] = await db.select({
    id: tables.webhooks.id,
    secret: tables.webhooks.secret
  })
    .from(tables.webhooks)
    .innerJoin(tables.streamers,
      eq(tables.webhooks.streamerId, tables.streamers.id)
    )
    .where(
      and(
        eq(tables.webhooks.subscriptionId, subscriptionId),
        eq(tables.webhooks.type, 'stream.online' as EventSubSubscriptionType),
        eq(tables.webhooks.status, 'pending' as WebhookStatus),
        isNotNull(tables.webhooks.secret),
        eq(tables.streamers.twitchBroadcasterId, broadcasterId)
      )
    )

  if (webhook === undefined || webhook.secret === null) {
    throw createError({
      status: 404
    })
  }

  const decryptedSecret = await decrypt(webhook.secret, encryptionKey)

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

async function handleNotificationRequest(event: H3Event<EventHandlerRequest>) {
  // const rawBody = await readRawBody(event)

  // if (rawBody === undefined) {
  //   return handleError(403, 'Failed to read the raw body')
  // }

  // const isVerified = await verifyEventMessage({
  //   body: rawBody,
  //   messageId: output.messageId,
  //   messageTimestamp: output.messageTimestamp,
  //   messageSignature: output.messageSignature,
  //   secret: TWITCH_APP_SECRET,
  // })

  // if (isVerified === false) {
  //   return handleError(403, 'Failed to verify the event message')
  // }

  // // TODO: Implement the rest of the logic
  // // const body = await readBody(event)

  // return {
  //   verified: isVerified
  // }
}

async function handleRevocationRequest(event: H3Event<EventHandlerRequest>) {
  // TODO: Implement the revocation request handling
}

export default defineEventHandler(async (event) => {
  const messageTypeHeader = getHeader(event, 'twitch-eventsub-message-type')
  const messageType = validateTwitchEventSubMessageType(messageTypeHeader)

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
