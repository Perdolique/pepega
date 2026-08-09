import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (relation) => {
  return {
    users: {
      oauthAccounts: relation.many.oauthAccounts({
        from: relation.users.id,
        to: relation.oauthAccounts.userId,
      }),
      streamers: relation.many.streamers({
        from: relation.users.id,
        to: relation.streamers.userId,
      }),
      telegramChannels: relation.many.telegramChannels({
        from: relation.users.id,
        to: relation.telegramChannels.userId,
      }),
    },

    oauthProviders: {
      oauthAccounts: relation.many.oauthAccounts({
        from: relation.oauthProviders.id,
        to: relation.oauthAccounts.providerId,
      }),
    },

    oauthAccounts: {
      user: relation.one.users({
        from: relation.oauthAccounts.userId,
        to: relation.users.id,
      }),
      provider: relation.one.oauthProviders({
        from: relation.oauthAccounts.providerId,
        to: relation.oauthProviders.id,
      }),
    },

    streamers: {
      user: relation.one.users({
        from: relation.streamers.userId,
        to: relation.users.id,
      }),
      webhooks: relation.many.webhooks({
        from: relation.streamers.id,
        to: relation.webhooks.streamerId,
      }),
      notifications: relation.many.notifications({
        from: relation.streamers.id,
        to: relation.notifications.streamerId,
      }),
    },

    webhooks: {
      streamer: relation.one.streamers({
        from: relation.webhooks.streamerId,
        to: relation.streamers.id,
      }),
    },

    telegramChannels: {
      user: relation.one.users({
        from: relation.telegramChannels.userId,
        to: relation.users.id,
      }),
      notificationDestinations: relation.many.notificationDestinations({
        from: relation.telegramChannels.id,
        to: relation.notificationDestinations.telegramChannelId,
      }),
    },

    notificationProviders: {
      notificationDestinations: relation.many.notificationDestinations({
        from: relation.notificationProviders.id,
        to: relation.notificationDestinations.providerId,
      }),
    },

    notifications: {
      streamer: relation.one.streamers({
        from: relation.notifications.streamerId,
        to: relation.streamers.id,
      }),
      notificationDestinations: relation.many.notificationDestinations({
        from: relation.notifications.id,
        to: relation.notificationDestinations.notificationId,
      }),
    },

    notificationDestinations: {
      notification: relation.one.notifications({
        from: relation.notificationDestinations.notificationId,
        to: relation.notifications.id,
      }),
      provider: relation.one.notificationProviders({
        from: relation.notificationDestinations.providerId,
        to: relation.notificationProviders.id,
      }),
      telegramChannel: relation.one.telegramChannels({
        from: relation.notificationDestinations.telegramChannelId,
        to: relation.telegramChannels.id,
      }),
    },
  };
});
