import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context

  const streamer = await db.query.streamers.findFirst({
    columns: {
      id: true,
      broadcasterId: true
    },

    where: eq(tables.streamers.userId, userId)
  })

  if (streamer === undefined) {
    throw createError({
      statusCode: 404
    })
  }

  return streamer
})
