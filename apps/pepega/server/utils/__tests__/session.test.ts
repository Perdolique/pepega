import { once } from 'node:events'
import { createServer, type Server } from 'node:http'
import { promisify } from 'node:util'
import { createApp, defineEventHandler, toNodeListener } from 'h3'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { clearAppSession } from '../session'

describe(clearAppSession, () => {
  let server: Server
  let url: URL

  beforeAll(async () => {
    const app = createApp()

    app.use(defineEventHandler(async (event) => {
      await clearAppSession(event)
    }))

    server = createServer(toNodeListener(app))
    server.listen(0, '127.0.0.1')

    await once(server, 'listening')

    const address = server.address()

    if (address === null || typeof address === 'string') {
      throw new Error('Test server did not bind to a TCP port')
    }

    url = new URL(`http://127.0.0.1:${address.port}`)
  })

  afterAll(async () => {
    const closeServer = promisify(server.close.bind(server))

    await closeServer()
  })

  it('should expire the session cookie immediately', async () => {
    const response = await fetch(url, {
      method: 'POST'
    })

    expect(response.headers.getSetCookie()).toStrictEqual([
      'pepeger=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict'
    ])
  })
})
