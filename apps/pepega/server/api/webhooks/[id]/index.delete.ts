import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import { webhookIdSchema } from '~~/server/utils/validation'

const paramsSchema = v.object({
  id: webhookIdSchema
})

function idValidator(params: unknown) {
  return v.parse(paramsSchema, params)
}

export default defineEventHandler(async (event) => {
  const { db } = event.context
  const { id: webhookId } = await getValidatedRouterParams(event, idValidator)

  await validateAdmin(event)

  const deleted = await db
    .delete(tables.webhooks)
    .where(
      eq(tables.webhooks.id, webhookId)
    )
    .returning({
      id: tables.webhooks.id
    })

  if (deleted.length === 0) {
    throw createError({
      statusCode: 404
    })
  }

  return sendNoContent(event)
})
