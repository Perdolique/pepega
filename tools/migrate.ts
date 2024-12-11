import { migrate } from 'drizzle-orm/neon-serverless/migrator'
import { createDrizzleWebsocket } from '../src/lib/server/db/connection'
import drizzleConfig from '../drizzle.config'

if (drizzleConfig.out === undefined) {
  throw new Error('drizzleConfig.out is not defined')
}

const db = createDrizzleWebsocket()

await migrate(db, {
  migrationsFolder: drizzleConfig.out
})

await db.$client.end()
