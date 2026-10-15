import { once } from 'node:events'
import { createServer, type Server } from 'node:http'
import { promisify } from 'node:util'
import { createApp, createRouter, defineEventHandler, toNodeListener } from '@nuxt/nitro-server/h3'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { toTestHandler } from '~~/test-utils/portable-handler'
import createNotificationHandler from '../api/notifications/index.post'
import { updateAppSession } from '../utils/session'
import logoutHandler from '../api/user/logout.post'
import apiSessionCheck from '../middleware/1.api-session-check'
import { checkAdmin } from '../utils/admin'
import { getSessionUser } from '../utils/user'

describe('authentication', () => {
  const findFirstUser = vi.fn()
  const originalSessionSecret = process.env.SESSION_SECRET
  let server: Server
  let url: URL

  beforeAll(async () => {
    process.env.SESSION_SECRET = 'test-session-secret-with-enough-entropy'

    const app = createApp()
    const router = createRouter()

    app.use(defineEventHandler((event) => {
      Reflect.set(event.context, 'db', {
        query: {
          users: {
            findFirst: findFirstUser
          }
        }
      })
    }))

    app.use(toTestHandler(apiSessionCheck))

    router.get('/session-user', toTestHandler(async (event) => {
      return await getSessionUser(event)
    }))

    router.get('/admin-check', toTestHandler(async (event) => {
      return await checkAdmin(event, {
        force: true
      })
    }))

    router.get('/api/private', defineEventHandler(() => {
      return 'authenticated'
    }))

    router.post('/api/user/logout', toTestHandler(logoutHandler))
    router.post('/api/notifications', toTestHandler(createNotificationHandler))
    router.post('/session-login', toTestHandler(async (event) => {
      await updateAppSession(event, { userId: 'test-user' })
      event.res.status = 204

      return null
    }))

    app.use(router)

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
    if (originalSessionSecret === undefined) {
      delete process.env.SESSION_SECRET
    } else {
      process.env.SESSION_SECRET = originalSessionSecret
    }

    const closeServer = promisify(server.close.bind(server))

    await closeServer()
  })

  it('should reject an API request without an authenticated session', async () => {
    const response = await fetch(new URL('/api/private', url))

    expect(response.status).toBe(401)
  })

  it('should authenticate a later request with a native session cookie', async () => {
    const loginUrl = new URL('/session-login', url)
    const login = await fetch(loginUrl, { method: 'POST' })
    const cookies = login.headers.getSetCookie()
    const cookie = cookies.at(-1)?.split(';')[0]

    expect(login.status).toBe(204)
    expect(cookie).toBeDefined()

    const privateUrl = new URL('/api/private', url)
    const response = await fetch(privateUrl, { headers: { cookie: cookie ?? '' } })

    expect(response.status).toBe(200)
    await expect(response.text()).resolves.toBe('authenticated')
    expect(cookies.at(-1)).toContain('HttpOnly; Secure; SameSite=Strict')
    expect(cookies.at(-1)).toContain('Max-Age=604800')
  })

  it('should reject invalid notification input before using the database', async () => {
    const loginUrl = new URL('/session-login', url)
    const login = await fetch(loginUrl, { method: 'POST' })
    const cookie = login.headers.getSetCookie().at(-1)?.split(';')[0]
    const notificationUrl = new URL('/api/notifications', url)
    const response = await fetch(notificationUrl, {
      method: 'POST',
      headers: { cookie: cookie ?? '', 'content-type': 'application/json' },
      body: JSON.stringify({ eventType: 'invalid' })
    })

    expect(response.status).toBe(400)
  })

  it('should reject a tampered session cookie', async () => {
    const privateUrl = new URL('/api/private', url)
    const response = await fetch(privateUrl, {
      headers: { cookie: 'pepeger=not-a-valid-session' }
    })

    expect(response.status).toBe(401)
  })

  it('should allow logout without an authenticated session', async () => {
    const response = await fetch(new URL('/api/user/logout', url), {
      method: 'POST'
    })

    expect(response.status).toBe(204)
  })

  it('should return the guest user without querying the database', async () => {
    const response = await fetch(new URL('/session-user', url))
    const user: unknown = await response.json()

    expect(user).toStrictEqual({
      id: null,
      isAdmin: false,
      isStreamer: false
    })
    expect(findFirstUser).not.toHaveBeenCalled()
  })

  it('should reject an admin check without querying the database', async () => {
    const response = await fetch(new URL('/admin-check', url))
    const isAdmin: unknown = await response.json()

    expect(isAdmin).toBe(false)
    expect(findFirstUser).not.toHaveBeenCalled()
  })
})
