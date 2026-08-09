import { clearAppSession } from '~~/server/utils/session'
import { defineEventHandler, sendNoContent } from 'h3'

export default defineEventHandler(async (event) => {
  await clearAppSession(event)

  sendNoContent(event)
})
