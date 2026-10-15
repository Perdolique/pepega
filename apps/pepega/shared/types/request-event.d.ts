import type { createDrizzle } from '@pepega/database/connection'

// Shared declarations also type server handlers reached through generated fetch types.
declare module '@nuxt/schema' {
  interface RequestEventContext {
    db: ReturnType<typeof createDrizzle>;
    userId: string;
  }
}
