import { defineConfig } from 'drizzle-kit'

if (process.env.DATABASE_URL === undefined) {
  throw new Error('enviroment variable DATABASE_URL is not set')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './schema.ts',
  out: './migrations',
  strict: true,

  // TODO: drizzle-kit doesn't support different drivers at the same time
  // https://orm.drizzle.team/kit-docs/upgrade-21#:~:text=For%20postgresql%20dialect%2C%20Drizzle%20will%3A
  // That's why we can't use local postgresql for development and cloud postgresql for production
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
})
