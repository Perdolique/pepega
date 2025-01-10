import { createDrizzleWebsocket } from '~~/server/utils/database'
import { migrate } from 'drizzle-orm/neon-serverless/migrator'
import drizzleConfig from '~~/drizzle.config'

if (process.env.DATABASE_URL === undefined) {
  throw new Error('DATABASE_URL is not defined')
}

if (drizzleConfig.out === undefined) {
  throw new Error('drizzleConfig.out is not defined')
}

const db = createDrizzleWebsocket()

await migrate(db, {
  migrationsFolder: drizzleConfig.out
})

await db.$client.end()
