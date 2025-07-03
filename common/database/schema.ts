import { limits } from './constants'
import { relations, sql } from 'drizzle-orm'
import { boolean, index, integer, jsonb, pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import type { NotificationDestinationConfig, NotificationProviderType } from './types'

/**
 * Users table
 */

export const users = pgTable('users', {
  id:
    uuid()
    .default(sql`uuid_generate_v7()`)
    .primaryKey(),

  isAdmin:
    boolean()
    .notNull()
    .default(false),

  isStreamer:
    boolean()
    .notNull()
    .default(false),

  createdAt:
    timestamp({
      withTimezone: true,
      mode: 'string'
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
      withTimezone: true,
      mode: 'string'
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
      withTimezone: true,
      mode: 'string'
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

  broadcasterId:
    varchar()
    .notNull(),

  login: varchar(),
  displayName: varchar(),

  userId:
    uuid()
    .references(() => users.id, {
      onDelete: 'set null',
      onUpdate: 'cascade'
    }),

  createdAt:
    timestamp({
      withTimezone: true,
      mode: 'string'
    })
    .notNull()
    .defaultNow()
}, (table) => [
  unique().on(table.userId, table.broadcasterId),
  index().on(table.broadcasterId)
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

  // Hashed secret used to sign the webhook on the Twitch side
  secretHash: varchar(),

  // The subscription ID from Twitch registration
  // TODO: createdAt should be used to get only the latest subscription
  subscriptionId: varchar(),

  createdAt:
    timestamp({
      withTimezone: true,
      mode: 'string'
    })
    .notNull()
    .defaultNow()
}, (table) => [
  unique().on(table.streamerId, table.type),
  index().on(table.subscriptionId, table.type)
])

/**
 * Telegram channels
 *
 * This table is used to store telegram channels
 */
export const telegramChannels = pgTable('telegramChannels', {
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

  /** Example: @perdTV */
  chatId:
    varchar()
    .notNull()
    .unique(),

  isVerified:
    boolean()
    .notNull()
    .default(false),

  createdAt:
    timestamp({
      withTimezone: true,
      mode: 'string'
    })
    .notNull()
    .defaultNow()
})

/**
 * Notification providers
 *
 * This table is used to store preconfigured providers (Telegram, Discord, etc.)
 */
export const notificationProviders = pgTable('notificationProviders', {
  id:
    integer()
    .primaryKey()
    .generatedAlwaysAsIdentity({
      startWith: 1
    }),

  // 'telegram', 'discord', etc.
  type:
    varchar()
    .notNull()
    .unique()
    .$type<NotificationProviderType>(),

  // Human readable name of the provider: 'Telegram', 'Discord', etc.
  name:
    varchar()
    .notNull(),

  createdAt:
    timestamp({
      withTimezone: true,
      mode: 'string'
    })
    .notNull()
    .defaultNow()
})

/**
 * Notifications
 *
 * This table is used to store notifications for specific streamers and notification types
 * Example: 'stream.online' for Perdolique
 */
export const notifications = pgTable('notifications', {
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

  // TODO: add $type<EventSubscriptionType>() if it makes sense
  eventType:
    varchar()
    .notNull(),

  isActive:
    boolean()
    .notNull()
    .default(true),

  createdAt:
    timestamp({
      withTimezone: true,
      mode: 'string'
    })
    .notNull()
    .defaultNow()
}, (table) => [
  unique().on(table.streamerId, table.eventType)
])

/**
 * Notification destinations
 *
 * Specific settings for each notification and destination
 */
export const notificationDestinations = pgTable('notificationDestinations', {
  id:
    integer()
    .primaryKey()
    .generatedAlwaysAsIdentity({
      startWith: 1
    }),

  notificationId:
    integer()
    .notNull()
    .references(() => notifications.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),

  providerId:
    integer()
    .notNull()
    .references(() => notificationProviders.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),

  message:
    varchar()
    .notNull(),

  // Polymorphic provider configuration 🚀
  config:
    jsonb()
    .$type<NotificationDestinationConfig>()
    .notNull(),

  /** This field ensures database-level data integrity constraints */
  telegramChannelId:
    integer()
    .references(() => telegramChannels.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),

  isActive:
    boolean()
    .notNull()
    .default(true),

  createdAt:
    timestamp({
      withTimezone: true,
      mode: 'string'
    })
    .notNull()
    .defaultNow()
}, (table) => [
  unique().on(table.notificationId, table.providerId)
])

/**
 * Configs
 */
export const config = pgTable('config', {
  key:
    varchar()
    .primaryKey()
    .notNull(),

  value:
    varchar()
    .notNull()
})

/**
 * Relations
 */

export const usersRelations = relations(users, ({ many }) => ({
  oauthAccounts: many(oauthAccounts),
  streamers: many(streamers),
  telegramChannels: many(telegramChannels)
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

  webhooks: many(webhooks),
  notifications: many(notifications)
}))

export const webhooksRelations = relations(webhooks, ({ one }) => ({
  streamer: one(streamers, {
    fields: [webhooks.streamerId],
    references: [streamers.id]
  })
}))

export const telegramChannelsRelations = relations(telegramChannels, ({ one, many }) => ({
  user: one(users, {
    fields: [telegramChannels.userId],
    references: [users.id]
  }),

  notificationDestinations: many(notificationDestinations)
}))

export const notificationProvidersRelations = relations(notificationProviders, ({ many }) => ({
  notificationDestinations: many(notificationDestinations)
}))

export const notificationsRelations = relations(notifications, ({ one, many }) => ({
  streamer: one(streamers, {
    fields: [notifications.streamerId],
    references: [streamers.id]
  }),

  notificationDestinations: many(notificationDestinations)
}))

export const notificationDestinationsRelations = relations(notificationDestinations, ({ one }) => ({
  notification: one(notifications, {
    fields: [notificationDestinations.notificationId],
    references: [notifications.id]
  }),

  provider: one(notificationProviders, {
    fields: [notificationDestinations.providerId],
    references: [notificationProviders.id]
  }),

  telegramChannel: one(telegramChannels, {
    fields: [notificationDestinations.telegramChannelId],
    references: [telegramChannels.id]
  })
}))
