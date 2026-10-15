import { createError, getRouterParams, type RequestEvent } from 'nuxt/server'
import * as v from 'valibot'

/** Validates decoded route parameters and preserves the API's HTTP 400 contract. */
export function parseRouterParams<Schema extends v.GenericSchema>(
  event: RequestEvent,
  schema: Schema
) : v.InferOutput<Schema> {
  const params = getRouterParams(event, { decode: true })
  const result = v.safeParse(schema, params)

  if (!result.success) {
    throw createError({
      status: 400,
      statusText: 'Validation Error',
      data: { issues: result.issues }
    })
  }

  return result.output
}
