import { defineEventHandler, getRequestURL, toWebRequest, type H3Event } from '@nuxt/nitro-server/h3'
import type { EventHandler, RequestEvent } from 'nuxt/server'

const portableEvents = new WeakMap<H3Event, RequestEvent>()

/** Runs portable handlers over HTTP while preserving response headers and status. */
export function toTestHandler(handler: EventHandler<unknown>) {
  return defineEventHandler(async (event) => {
    // Fixtures supply only the database methods used by each test.
    const context = event.context as RequestEvent['context']
    let portable = portableEvents.get(event)

    if (portable === undefined) {
      portable = {
        req: toWebRequest(event),
        url: getRequestURL(event),
        context,
        res: { headers: new globalThis.Headers() }
      }
      portableEvents.set(event, portable)
    }

    try {
      return await handler(portable)
    } finally {
      if (portable.res.status !== undefined) {
        event.node.res.statusCode = portable.res.status
      }

      for (const [name, value] of portable.res.headers) {
        if (name !== 'set-cookie') {
          event.node.res.setHeader(name, value)
        }
      }

      const cookies = portable.res.headers.getSetCookie()

      if (cookies.length > 0) {
        event.node.res.setHeader('set-cookie', cookies)
      }
    }
  })
}
