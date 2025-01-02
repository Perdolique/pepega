import { createDrizzleWebsocket, tables, type DatabaseHttpConnection } from '$lib/server/db/connection.js'
import { getTwitchOAuthToken, getTwitchUserInfo } from '$lib/server/oauth/twitch'
import { createSession } from '$lib/session.js'
import { json } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { env } from '$env/dynamic/private'

const codeSchema = v.pipe(
  v.string(),
  v.nonEmpty()
)

const provider = 'twitch'

async function findTwitchUser(db: DatabaseHttpConnection, twitchAccountId: string) {
  const [foundUser] = await db
    .select({
      userId: tables.oauthAccounts.userId
    })
    .from(tables.oauthAccounts)
    .innerJoin(
      tables.oauthProviders,

      and(
        eq(tables.oauthProviders.id, tables.oauthAccounts.providerId),
        eq(tables.oauthProviders.type, provider),
        eq(tables.oauthAccounts.accountId, twitchAccountId)
      )
    )
    .innerJoin(
      tables.users,
      eq(tables.users.id, tables.oauthAccounts.userId)
    )

  return foundUser
}

async function createTwitchUser(twitchAccountId: string) {
  const isLocalDatabase = env.NEON_WEBSOCKET_PROXY_ENABLED === '1'

  const db = createDrizzleWebsocket({
    databaseUrl: env.DATABASE_URL,
    isLocalDatabase
  })

  const newUser = await db.transaction(async (transaction) => {
    const providerData = await transaction.query.oauthProviders.findFirst({
      columns: {
        id: true
      },

      where: eq(tables.oauthProviders.type, provider)
    })

    if (providerData === undefined) {
      throw new Error(`Provider ${provider} not found`)
    }

    // Create a new user
    const [createdUser] = await transaction
      .insert(tables.users)
      .values({})
      .returning({
        userId: tables.users.id
      })

    if (createdUser?.userId === undefined) {
      throw new Error('Failed to create user')
    }

    // Link the user to the OAuth provider
    await transaction
      .insert(tables.oauthAccounts)
      .values({
        userId: createdUser.userId,
        accountId: twitchAccountId,
        providerId: providerData.id
      })

    return {
      userId: createdUser.userId
    }
  })

  return {
    userId: newUser.userId
  }
}

export async function POST(event) {
  const { request, locals } = event

  // Check if the user is already authenticated
  if (locals.userId !== undefined) {
    return json(
      { message: 'Unauthorized' },
      { status: 401 }
    )
  }

  // TODO: We can handle some Twitch-specific errors here instead of throwing with code 500
  try {
    const { code } = await request.json()
    const { success, output: validCode } = v.safeParse(codeSchema, code)

    if (success === false) {
      return json(
        { message: 'Invalid code' },
        { status: 401 }
      )
    }

    const twitchToken = await getTwitchOAuthToken(event, validCode)
    const { id: twitchAccountId } = await getTwitchUserInfo(twitchToken)
    const foundUser = await findTwitchUser(locals.db, twitchAccountId)

    // Create a new user if the user doesn't exist
    if (foundUser === undefined) {
      const newUser = await createTwitchUser(twitchAccountId)

      await createSession(event, {
        userId: newUser.userId
      })
    } else {
      await createSession(event, {
        userId: foundUser.userId
      })
    }

    return new Response(null, {
      status: 204
    })
  } catch (error) {
    console.error(error)

    return json(
      { message: 'Internal server error ツ' },
      { status: 500 }
    )
  }
}
