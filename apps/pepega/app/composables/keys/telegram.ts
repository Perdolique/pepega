export const telegramQueryKeys = {
  root: ['telegram'],
  channels: () => [...telegramQueryKeys.root, 'channels']
} as const
