import { limits } from '../../constants'
import { relations, sql } from 'drizzle-orm'
import { integer, pgTable, primaryKey, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'

/**
 * Users table
 */
export const users = pgTable('users', {
  id:
    uuid()
    .default(sql`uuid_generate_v7()`)
    .primaryKey(),

  createdAt:
    timestamp({
      withTimezone: true
    })
    .notNull()
    .defaultNow()
})

/**
 * OAuth providers table
 *
 * This table is used to store OAuth providers
 * For example, Twitch, Google, Facebook, etc.
 */
export const oauthProviders = pgTable('oauthProviders', {
  id:
    integer()
    .primaryKey()
    .generatedAlwaysAsIdentity({
      startWith: 1
    }),

  type:
    varchar({
      length: limits.maxOAuthProviderTypeLength
    })
    .notNull()
    .unique(),

  name:
    varchar({
      length: limits.maxOAuthProviderNameLength
    })
    .notNull(),

  createdAt:
    timestamp({
      withTimezone: true
    })
    .notNull()
    .defaultNow()
})

/**
 * OAuth accounts table
 *
 * This table is used to store OAuth accounts linked to the user
 * For example, if the user logs in with Twitch, we store the Twitch account ID here
 */
export const oauthAccounts = pgTable('oauthAccounts', {
  id:
    uuid()
    .default(sql`uuid_generate_v7()`)
    .primaryKey(),

  userId:
    uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),

  providerId:
    integer()
    .notNull()
    .references(() => oauthProviders.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),

  accountId:
    varchar()
    .notNull(),

  createdAt:
    timestamp({
      withTimezone: true
    })
    .notNull()
    .defaultNow()
}, (table) => [
  unique().on(table.providerId, table.accountId)
])

/**
 * Streamers table
 *
 * This table is used to store streamers
 */
export const streamers = pgTable('streamers', {
  id:
    integer()
    .primaryKey()
    .generatedAlwaysAsIdentity({
      startWith: 1
    }),

  userId:
    uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),

  twitchBroadcasterId:
    varchar()
    .notNull(),

  createdAt:
    timestamp({
      withTimezone: true
    })
    .notNull()
    .defaultNow()
}, (table) => [
  unique().on(table.userId, table.twitchBroadcasterId)
])

/**
 * Webhooks
 *
 * This table is used to store webhooks
 */
export const webhooks = pgTable('webhooks', {
  id:
    integer()
    .primaryKey()
    .generatedAlwaysAsIdentity({
      startWith: 1
    }),

  streamerId:
    integer()
    .notNull()
    .references(() => streamers.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),

  // Example: https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#streamonline
  type:
    varchar()
    .notNull(),

  // not_active, active, pending, failed, revoked
  status:
    varchar()
    .notNull()
    .default('not_active'),

  createdAt:
    timestamp({
      withTimezone: true,
      mode: 'string'
    })
    .notNull()
    .defaultNow()
}, (table) => [
  unique().on(table.streamerId, table.type)
])

/**
 * Relations
 */

export const usersRelations = relations(users, ({ many }) => ({
  oauthAccounts: many(oauthAccounts),
  streamers: many(streamers)
}))

export const oauthProvidersRelations = relations(oauthProviders, ({ many }) => ({
  oauthAccounts: many(oauthAccounts)
}))

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id]
  }),

  provider: one(oauthProviders, {
    fields: [oauthAccounts.providerId],
    references: [oauthProviders.id]
  })
}))

export const streamersRelations = relations(streamers, ({ one, many }) => ({
  user: one(users, {
    fields: [streamers.userId],
    references: [users.id]
  }),

  webhooks: many(webhooks)
}))

export const webhooksRelations = relations(webhooks, ({ one }) => ({
  streamer: one(streamers, {
    fields: [webhooks.streamerId],
    references: [streamers.id]
  })
}))
