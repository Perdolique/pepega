import { createError, type H3Event } from 'h3'
import { and, eq } from 'drizzle-orm'
import type { OAuthProvider, OAuthUser } from '~~/shared/models/oauth'
import { useAppSession } from '~~/server/utils/session'
import type { UserModel } from '~~/shared/models/user';
import { createDatabaseWebsocket, tables } from '~~/server/utils/database';

const defaultUser : UserModel = {
  displayName: null,
  id: null,
  isAdmin: false,
  isStreamer: false,
  login: null
}

export async function getSessionUser(event: H3Event) : Promise<UserModel> {
  const session = await useAppSession(event)
  const { userId } = session.data

  if (typeof userId !== 'string') {
    return defaultUser
  }

  // Check if the user in database
  const users = await event.context.db.query.users
    .findFirst({
      columns: {
        id: true,
        isAdmin: true,
        isStreamer: true
      },

      with: {
        streamers: {
          columns: {
            displayName: true,
            login: true
          },
          limit: 1
        }
      },

      where: {
        id: userId
      }
    })

  if (users?.id === undefined) {
    return defaultUser
  }

  const streamer = users.streamers[0]

  return {
    displayName: streamer?.displayName ?? null,
    id: users.id,
    isAdmin: users.isAdmin,
    isStreamer: users.isStreamer,
    login: streamer?.login ?? null
  }
}

export async function getUserByOAuthAccount(
  event: H3Event,
  provider: OAuthProvider,
  accountId: string
) : Promise<UserModel> {
  const { db } = event.context

  const [foundUser] = await db
    .select({
      id: tables.oauthAccounts.userId,
      isAdmin: tables.users.isAdmin,
      isStreamer: tables.users.isStreamer,
      displayName: tables.streamers.displayName,
      login: tables.streamers.login
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
    .leftJoin(
      tables.streamers,
      eq(tables.streamers.userId, tables.users.id)
    )

  return foundUser ?? defaultUser
}

export async function createOAuthUser({ provider, user } : OAuthUser) : Promise<UserModel> {
  const db = createDatabaseWebsocket()

  const newUser = await db.transaction(async (transaction) : Promise<UserModel> => {
    const providerData = await transaction.query.oauthProviders.findFirst({
      columns: {
        id: true
      },

      where: {
        type: provider
      }
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
        id: tables.users.id,
        isAdmin: tables.users.isAdmin,
        isStreamer: tables.users.isStreamer
      })

    if (foundUser?.id === undefined) {
      throw createError({
        message: 'Failed to create user',
        statusCode: 500
      })
    }

    // Link the user to the OAuth provider
    await transaction
      .insert(tables.oauthAccounts)
      .values({
        userId: foundUser.id,
        accountId: user.id,
        providerId: providerData.id
      })

    // TODO: Move this to a separate function
    if (provider === 'twitch') {
      // Check if the user is a streamer
      const foundStreamer = await transaction.query.streamers.findFirst({
        columns: {
          id: true
        },

        where: {
          broadcasterId: user.id
        }
      })

      if (foundStreamer === undefined) {
        await transaction
          .insert(tables.streamers)
          .values({
            userId: foundUser.id,
            broadcasterId: user.id,
            displayName: user.display_name,
            login: user.login
          })
      } else {
        await transaction
          .update(tables.streamers)
          .set({
            userId: foundUser.id,
            displayName: user.display_name,
            login: user.login
          })
          .where(
            eq(tables.streamers.broadcasterId, user.id)
          )
      }
    }

    return {
      displayName: user.display_name,
      id: foundUser.id,
      isAdmin: foundUser.isAdmin,
      isStreamer: foundUser.isStreamer,
      login: user.login
    }
  })

  return {
    displayName: newUser.displayName,
    id: newUser.id,
    isAdmin: newUser.isAdmin,
    isStreamer: newUser.isStreamer,
    login: newUser.login
  }
}
