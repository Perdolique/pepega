import { and, eq } from 'drizzle-orm'
import type { OAuthProvider } from '~~/shared/models/oauth'

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context

  const streamer = await db.query.streamers.findFirst({
    columns: {
      id: true,
      twitchBroadcasterId: true
    },

    where: eq(tables.streamers.userId, userId)
  })

  // Streamer already exists
  if (streamer !== undefined) {
    setResponseStatus(event, 200)

    return streamer
  }

  const provider : OAuthProvider = 'twitch'

  // Streamer does not exist, get the Twitch broadcaster ID
  const [foundAccount] = await db.select({
    twitchBroadcasterId: tables.oauthAccounts.accountId
  })
    .from(tables.oauthAccounts)
    .innerJoin(
      tables.oauthProviders,
      eq(tables.oauthProviders.id, tables.oauthAccounts.providerId)
    )
    .where(
      and(
        eq(tables.oauthAccounts.userId, userId),
        eq(tables.oauthProviders.type, provider)
      )
    )
    .limit(1)

  if (foundAccount === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Twitch account is not linked'
    })
  }

  const [insertedStreamer] = await db.insert(tables.streamers)
    .values({
      userId,
      twitchBroadcasterId: foundAccount.twitchBroadcasterId
    })
    .returning({
      id: tables.streamers.id,
      twitchBroadcasterId: tables.streamers.twitchBroadcasterId
    })

  if (insertedStreamer === undefined) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create streamer'
    })
  }

  setResponseStatus(event, 201)

  return insertedStreamer
})
