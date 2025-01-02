import { createDrizzle } from '$lib/server/db/connection'
import { handleSession } from '$lib/session'
import { env } from '$env/dynamic/private'

export async function handle(input) {
  // Create a new database connection if it doesn't exist
  if (input.event.locals.db === undefined) {
    const db = createDrizzle({
      databaseUrl: env.DATABASE_URL,
      neonFetchProxy: env.NEON_FETCH_PROXY
    })

    input.event.locals.db = db
  }

  return await handleSession(input)
}
