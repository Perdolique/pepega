import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'

declare module 'h3' {
  interface H3EventContext {
    db: NeonHttpDatabase<typeof tables>
  }
}

export default defineEventHandler(async ({ context }) => {
  if (context.db === undefined) {
    const drizzleDb = createDatabase()

    context.db = drizzleDb
  }
})
