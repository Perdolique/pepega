import { clearAppSession } from '~~/server/utils/session'
import { defineEventHandler } from 'nuxt/server'

export default defineEventHandler(async (event) => {
  await clearAppSession(event)

  event.res.status = 204

  return null
})
