import { defineConfig } from 'drizzle-kit'

if (process.env.DATABASE_URL === undefined) {
  throw new Error('DATABASE_URL is not set')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/server/db/schema.ts',
  verbose: true,
  strict: true,

  dbCredentials: {
    url: process.env.DATABASE_URL
  }
});