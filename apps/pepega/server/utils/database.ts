import { createDrizzle, createDrizzleWebsocket, tables } from '@pepega/database/connection'

export { tables }

export function createDatabase() {
  if (process.env.DATABASE_URL === undefined) {
    throw new Error('DATABASE_URL is not defined')
  }

  const isLocalDatabase = import.meta.dev === true || process.env.LOCAL_DATABASE === '1'

  return createDrizzle(process.env.DATABASE_URL, isLocalDatabase)
}

export function createDatabaseWebsocket() {
  if (process.env.DATABASE_URL === undefined) {
    throw new Error('DATABASE_URL is not defined')
  }

  const isLocalDatabase = import.meta.dev === true || process.env.NEON_WEBSOCKET_PROXY_ENABLED === '1'

  return createDrizzleWebsocket(process.env.DATABASE_URL, isLocalDatabase)
}
