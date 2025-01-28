import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context

  await db
    .delete(tables.streamers)
    .where(
      eq(tables.streamers.userId, userId)
    )

  return sendNoContent(event)
})
