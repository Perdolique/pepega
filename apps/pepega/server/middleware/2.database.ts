import { createDatabase } from '~~/server/utils/database'
import { defineEventHandler } from 'nuxt/server'

export default defineEventHandler(({ context }) => {
  if (context.db === undefined) {
    const drizzleDb = createDatabase()

    context.db = drizzleDb
  }
})
