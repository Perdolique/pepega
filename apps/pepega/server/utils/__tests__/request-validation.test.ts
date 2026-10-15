import { createDrizzle } from '@pepega/database/connection'
import { describe, expect, it } from 'vitest'
import * as v from 'valibot'
import type { RequestEvent } from 'nuxt/server'
import { parseRouterParams } from '../request-validation'
import { idStringAsNumberSchema } from '../validation'

const paramsSchema = v.object({ id: idStringAsNumberSchema })

function createParamsEvent(id: string) : RequestEvent {
  return {
    req: new Request(`https://pepega.test/items/${id}`),
    url: new URL(`https://pepega.test/items/${id}`),
    res: { headers: new Headers() },
    context: {
      params: { id },
      userId: 'test-user',
      db: createDrizzle('postgres://test:test@localhost/test')
    }
  }
}

describe(parseRouterParams, () => {
  it('decodes matched parameters before applying the schema', () => {
    const event = createParamsEvent('%31%32')
    const params = parseRouterParams(event, paramsSchema)

    expect(params).toStrictEqual({ id: 12 })
  })

  it.each(['0', 'text', '1.5'])('rejects invalid ID %s with HTTP 400', (id) => {
    const event = createParamsEvent(id)
    const validate = () => parseRouterParams(event, paramsSchema)

    expect(validate).toThrow(expect.objectContaining({ status: 400 }))
  })
})
