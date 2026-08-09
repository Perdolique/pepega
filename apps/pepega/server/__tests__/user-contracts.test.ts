import { once } from 'node:events'
import { createServer, type Server } from 'node:http'
import { promisify } from 'node:util'
import { createApp, createRouter, defineEventHandler, toNodeListener } from 'h3'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getOAuthToken: vi.fn().mockResolvedValue('access-token'),
  getSessionUser: vi.fn(),
  getUserByOAuthAccount: vi.fn(),
  getUserInfo: vi.fn(),
  updateAppSession: vi.fn()
}))

vi.mock(import('@pepega/twitch/auth'), () => ({
  getOAuthToken: mocks.getOAuthToken,
  getUserInfo: mocks.getUserInfo
}))

vi.mock(import('~~/server/utils/user'), () => ({
  createOAuthUser: vi.fn(),
  getSessionUser: mocks.getSessionUser,
  getUserByOAuthAccount: mocks.getUserByOAuthAccount
}))

vi.mock(import('~~/server/utils/session'), () => ({
  updateAppSession: mocks.updateAppSession
}))

vi.mock(import('~~/server/utils/validation'), () => ({
  getValidatedTwitchClientId: () => 'client-id',
  getValidatedTwitchClientSecret: () => 'client-secret'
}))

vi.mock(import('~~/server/utils/provider-twitch'), () => ({
  getTwitchRedirectUri: () => 'https://example.com/auth/twitch'
}))

describe('user response contracts', () => {
  let server: Server
  let url: URL

  beforeAll(async () => {
    const { default: oauthHandler } = await import('../api/oauth/twitch/index.post')
    const { default: streamerHandler } = await import('../api/user/[id]/streamer.patch')
    const app = createApp()
    const router = createRouter()

    app.use(defineEventHandler((event) => {
      const returning = vi.fn().mockResolvedValue([{
        id: 'user-id',
        isAdmin: false,
        isStreamer: true
      }])
      const where = vi.fn(() => ({ returning }))
      const set = vi.fn(() => ({ where }))
      const update = vi.fn(() => ({ set }))

      Reflect.set(event.context, 'db', { update })
      Reflect.set(event.context, 'userId', 'user-id')
    }))

    router.post('/oauth', oauthHandler)
    router.patch('/user/:id/streamer', streamerHandler)
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
    const closeServer = promisify(server.close.bind(server))

    await closeServer()
  })

  it('should preserve Twitch identity in the OAuth response', async () => {
    const user = {
      displayName: 'Perdolique',
      id: 'user-id',
      isAdmin: false,
      isStreamer: true,
      login: 'perdolique'
    }

    mocks.getSessionUser.mockResolvedValueOnce({
      displayName: null,
      id: null,
      isAdmin: false,
      isStreamer: false,
      login: null
    })
    mocks.getUserInfo.mockResolvedValueOnce([{
      display_name: 'Perdolique',
      id: 'broadcaster-id',
      login: 'perdolique'
    }])
    mocks.getUserByOAuthAccount.mockResolvedValueOnce(user)

    const response = await fetch(new URL('/oauth', url), {
      body: JSON.stringify({ code: 'oauth-code' }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    })

    await expect(response.json()).resolves.toStrictEqual(user)
  })

  it('should return the full user after changing streamer mode', async () => {
    const user = {
      displayName: 'Perdolique',
      id: 'user-id',
      isAdmin: false,
      isStreamer: true,
      login: 'perdolique'
    }

    mocks.getSessionUser.mockResolvedValueOnce(user)

    const response = await fetch(new URL('/user/user-id/streamer', url), {
      body: JSON.stringify({ isStreamer: true }),
      headers: { 'content-type': 'application/json' },
      method: 'PATCH'
    })

    await expect(response.json()).resolves.toStrictEqual(user)
  })
})
