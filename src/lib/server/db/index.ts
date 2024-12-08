import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '$env/dynamic/private'

if (typeof env.DATABASE_URL !== 'string') {
  throw new Error('DATABASE_URL is not set')
}

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client);
