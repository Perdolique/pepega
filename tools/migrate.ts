import { migrate } from 'drizzle-orm/neon-serverless/migrator'
import { createDrizzleWebsocket } from '../src/lib/server/db/connection'
import drizzleConfig from '../drizzle.config'

if (drizzleConfig.out === undefined) {
  throw new Error('drizzleConfig.out is not defined')
}

const db = createDrizzleWebsocket({
  databaseUrl: process.env.DATABASE_URL,
  isLocalDatabase: process.env.NEON_WEBSOCKET_PROXY_ENABLED === '1'
})

await migrate(db, {
  migrationsFolder: drizzleConfig.out
})

await db.$client.end()
