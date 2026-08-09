import { createDatabase } from '~~/server/utils/database'
import { defineEventHandler } from 'h3'

type Database = ReturnType<typeof createDatabase>

declare module 'h3' {
  interface H3EventContext {
    db: Database
  }
}

export default defineEventHandler(({ context }) => {
  if (context.db === undefined) {
    const drizzleDb = createDatabase()

    context.db = drizzleDb
  }
})
