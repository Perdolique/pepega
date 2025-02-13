import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context

  const result = await db
    .select({
      id: tables.webhooks.id,
      status: tables.webhooks.status,
      type: tables.webhooks.type,
      createdAt: tables.webhooks.createdAt
    })
    .from(tables.webhooks)
    .innerJoin(
      tables.streamers,
      eq(tables.streamers.id, tables.webhooks.streamerId)
    )
    .where(
      and(
        eq(tables.streamers.userId, userId)
      )
    )

  return result
})
