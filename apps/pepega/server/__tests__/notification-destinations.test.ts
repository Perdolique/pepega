import { once } from 'node:events'
import { createServer, type Server } from 'node:http'
import { promisify } from 'node:util'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'
import {
  createApp,
  createRouter,
  defineEventHandler,
  toNodeListener
} from 'h3'
import { afterEach, describe, expect, it, vi } from 'vitest'

interface TestServer {
  server: Server;
  url: URL;
}

const destination: NotificationDestinationModel = {
  id: 11,
  config: { type: 'telegram' },
  isActive: true,
  message: 'Stream is online',
  telegramChannelId: 7
}

const servers: Server[] = []

async function startServer(path: string, handler: ReturnType<typeof defineEventHandler>, db: unknown) : Promise<TestServer> {
  const app = createApp()
  const router = createRouter()

  app.use(defineEventHandler((event) => {
    Reflect.set(event.context, 'db', db)
    Reflect.set(event.context, 'userId', 'user-id')
  }))

  router.use(path, handler)
  app.use(router)

  const server = createServer(toNodeListener(app))

  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  servers.push(server)

  const address = server.address()

  if (address === null || typeof address === 'string') {
    throw new Error('Test server did not bind to a TCP port')
  }

  return {
    server,
    url: new URL(`http://127.0.0.1:${address.port}`)
  }
}

describe('notification destination contracts', () => {
  afterEach(async () => {
    const runningServers = servers.splice(0)

    await Promise.all(runningServers.map(async (server) => {
      const closeServer = promisify(server.close.bind(server))

      await closeServer()
    }))
  })

  it('returns the complete destination model', async () => {
    const query = {
      select: vi.fn(),
      from: vi.fn(),
      innerJoin: vi.fn(),
      where: vi.fn().mockResolvedValue([destination])
    }

    query.select.mockReturnValue(query)
    query.from.mockReturnValue(query)
    query.innerJoin.mockReturnValue(query)

    const { default: getDestinationHandler } = await import(
      '../api/notifications/destinations.get'
    )
    const { url } = await startServer(
      '/destinations',
      getDestinationHandler,
      query
    )
    const response = await fetch(
      new URL('/destinations?notificationId=3', url)
    )

    await expect(response.json()).resolves.toStrictEqual([destination])
  })

  it('upserts the same Telegram destination on repeated saves', async () => {
    const selectQuery = {
      select: vi.fn(),
      from: vi.fn(),
      innerJoin: vi.fn(),
      where: vi.fn()
    }

    selectQuery.select.mockReturnValue(selectQuery)
    selectQuery.from.mockReturnValue(selectQuery)
    selectQuery.innerJoin.mockReturnValue(selectQuery)
    selectQuery.where.mockReturnValue(selectQuery)

    const returning = vi.fn().mockResolvedValue([destination])
    const onConflictDoUpdate = vi.fn(() => ({ returning }))
    const values = vi.fn(() => ({ onConflictDoUpdate }))
    const insert = vi.fn(() => ({ values }))
    const withQuery = vi.fn(() => ({ insert }))
    const as = vi.fn((query: unknown) => query)
    const withClause = vi.fn(() => ({ as }))
    const db = {
      $with: withClause,
      select: selectQuery.select,
      with: withQuery
    }

    const { default: saveDestinationHandler } = await import(
      '../api/notifications/destinations.post'
    )
    const { url } = await startServer(
      '/destinations',
      saveDestinationHandler,
      db
    )
    const request = {
      body: JSON.stringify({
        notificationId: 3,
        message: destination.message,
        telegramChannelId: destination.telegramChannelId
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    }
    const firstResponse = await fetch(new URL('/destinations', url), request)
    const secondResponse = await fetch(new URL('/destinations', url), request)

    await expect(firstResponse.json()).resolves.toStrictEqual(destination)
    await expect(secondResponse.json()).resolves.toStrictEqual(destination)
    expect(values).toHaveBeenCalledTimes(2)
    expect(onConflictDoUpdate).toHaveBeenCalledTimes(2)
  })
})
