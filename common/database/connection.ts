import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless'
import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import ws from 'ws'
import * as schema from './schema'

export const tables = schema

export function createDrizzle(databaseUrl: string, isLocalDatabase = false) {
  if (isLocalDatabase) {
    // Check docker-compose.yml for the details
    neonConfig.fetchEndpoint = 'http://db.localtest.me:4444/sql'
  }

  const db = neon(databaseUrl)

  const drizzleDb = drizzleNeon({
    client: db,
    schema,
    logger: isLocalDatabase
  })

  return drizzleDb
}

/**
 * Create a Drizzle database instance with WebSocket support.
 * It requires for transactional operations.
 *
 * @see {@link https://orm.drizzle.team/docs/get-started-postgresql#neon-postgres}
 * @see {@link https://github.com/neondatabase/serverless?tab=readme-ov-file#sessions-transactions-and-node-postgres-compatibility}
 */
export function createDrizzleWebsocket(databaseUrl: string, isLocalDatabase = false) {
  neonConfig.webSocketConstructor = ws

  if (isLocalDatabase) {
    neonConfig.wsProxy = (host) => `${host}:5433/v1`
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
  }

  const pool = new Pool({
    connectionString: databaseUrl
  })

  const drizzleDb = drizzleServerless({
    client: pool,
    schema,
    logger: isLocalDatabase
  })

  return drizzleDb
}
