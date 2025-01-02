import ws from 'ws'
import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle as drizzleNeon, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless'
import * as schema from './schema'

export const tables = schema
export type DatabaseHttpConnection = NeonHttpDatabase<typeof tables>;

interface  CreateDrizzleParams {
  databaseUrl: string | undefined;
  neonFetchProxy: string | undefined;
}

interface CreateDrizzleWebsocketParams {
  databaseUrl: string | undefined;
  isLocalDatabase: boolean;
}

export function createDrizzle({ databaseUrl, neonFetchProxy } : CreateDrizzleParams) {
  if (databaseUrl === undefined) {
    throw new Error('databaseUrl is not defined')
  }

  if (neonFetchProxy !== undefined) {
    neonConfig.fetchEndpoint = neonFetchProxy
  }

  const db = neon(databaseUrl)

  const drizzleDb = drizzleNeon({
    client: db,
    schema,
    logger: true
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
export function createDrizzleWebsocket({ databaseUrl, isLocalDatabase } : CreateDrizzleWebsocketParams) {
  if (databaseUrl === undefined) {
    throw new Error('DATABASE_URL is not defined')
  }

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
    logger: true
  })

  return drizzleDb
}
