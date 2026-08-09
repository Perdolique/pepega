import { migrate } from 'drizzle-orm/neon-serverless/migrator'
import drizzleConfig from './drizzle.config'
import { createDrizzleWebsocket } from './connection'

if (process.env.DATABASE_URL === undefined) {
  throw new Error('DATABASE_URL is not defined')
}

if (drizzleConfig.out === undefined) {
  throw new Error('drizzleConfig.out is not defined')
}

const isLocalDatabase = process.env.LOCAL_DATABASE !== undefined
const db = createDrizzleWebsocket(process.env.DATABASE_URL, isLocalDatabase)

await migrate(db, {
  migrationsFolder: drizzleConfig.out
})

await db.$client.end()
