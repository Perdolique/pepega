import type { H3Event } from 'h3'
import { and, eq } from 'drizzle-orm'
import type { OAuthProvider } from '~~/shared/models/oauth';
import { useAppSession } from '~~/server/utils/session';

interface ReturnUser {
  readonly userId: string | null;
}

const defaultUser : ReturnUser = {
  userId: null
}

export async function getSessionUser(event: H3Event) : Promise<ReturnUser> {
  const session = await useAppSession(event)
  const { userId } = session.data

  if (userId === undefined) {
    return defaultUser
  }

  // Check if the user in database
  const users = await event.context.db.query.users
    .findFirst({
      columns: {
        id: true
      },

      where: eq(tables.users.id, userId)
    })

  if (users?.id === undefined) {
    return defaultUser
  }

  return {
    userId: users.id
  }
}

export async function getUserByOAuthAccount(
  event: H3Event,
  provider: OAuthProvider,
  accountId: string
) : Promise<ReturnUser> {
  const { db } = event.context

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
        eq(tables.oauthAccounts.accountId, accountId)
      )
    )
    .innerJoin(
      tables.users,
      eq(tables.users.id, tables.oauthAccounts.userId)
    )

  return foundUser ?? defaultUser
}

export async function createOAuthUser(
  provider: OAuthProvider,
  accountId: string
) {
  const db = createDrizzleWebsocket()

  const newUser = await db.transaction(async (transaction) => {
    const providerData = await transaction.query.oauthProviders.findFirst({
      columns: {
        id: true
      },

      where: eq(tables.oauthProviders.type, provider)
    })

    if (providerData === undefined) {
      throw createError({
        message: `OAuth provider ${provider} not found`,
        statusCode: 404
      })
    }

    // Create a new user
    const [foundUser] = await transaction
      .insert(tables.users)
      .values({})
      .returning({
        userId: tables.users.id
      })

    if (foundUser?.userId === undefined) {
      throw createError({
        message: 'Failed to create user',
        statusCode: 500
      })
    }

    // Link the user to the OAuth provider
    await transaction
      .insert(tables.oauthAccounts)
      .values({
        userId: foundUser.userId,
        accountId,
        providerId: providerData.id
      })

    return {
      userId: foundUser.userId
    }
  })

  return {
    userId: newUser.userId
  }
}
