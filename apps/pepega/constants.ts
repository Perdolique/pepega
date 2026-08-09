const sessionCookieName = 'pepeger';

// Admin check interval in milliseconds
const adminCheckInterval = 60 * 60 * 1000;

const publicApiPaths = ['/api/oauth/twitch'] as const;

const webhooksWorkerBaseUrls = {
  development: 'http://localhost:8788',
  staging: 'https://pooque-staging.pepega.app',
  production: 'https://pooque.pepega.app',
} as const;

const kvStorageName = 'kv';

const kvStorageKeys = {
  twitchAppAccessToken: 'twitchAppAccessToken',
};

const limits = {
  notificationMessageLength: 500,
};

export {
  sessionCookieName,
  adminCheckInterval,
  publicApiPaths,
  webhooksWorkerBaseUrls,
  kvStorageName,
  kvStorageKeys,
  limits,
};
