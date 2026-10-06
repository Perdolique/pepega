import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, computed, effectScope, nextTick, reactive, ref, type EffectScope } from 'vue'
import { useQuery, VueQueryPlugin } from '@tanstack/vue-query'
import { $fetch, FetchError, createFetchError } from 'ofetch'
import { createAppQueryClient, watchQueryUser } from '~/utils/query-client'
import { getTelegramVerificationFeedback } from '~/utils/telegram-verification-feedback'
import { getNotificationByType } from '../queries/notifications'
import { getTelegramChannels } from '../queries/telegram/channels'
import { getByNotificationId } from '../queries/notification/destinations'
import { useInitNotifications, useDeleteNotification } from '../mutations/notifications'
import { useAddTelegramChannel } from '../mutations/telegram/add-channel'
import { useDeleteTelegramChannel } from '../mutations/telegram/delete-channel'
import { useCreateTelegramNotification } from '../mutations/notification/destinations'
import { useQueryFeedback } from '../use-query-feedback'
import { telegramQueryKeys } from '../keys/telegram'
import { notificationKeys } from '../keys/notifications'
import { destinationKeys } from '../keys/notification/destinations'
import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
import type { NotificationDestinationModel, NotificationModel } from '~~/shared/models/notifications'

const state = vi.hoisted<{ user: { userId: string | null }; loggerError: ReturnType<typeof vi.fn> }>(() => ({
  user: { userId: 'alice' },
  loggerError: vi.fn()
}))

// These factories provide only the external methods used by these composables.
// oxlint-disable vitest/prefer-import-in-mock
vi.mock('~/stores/user', () => ({ useUserStore: () => state.user }))
vi.mock('@pepega/utils/logger', () => ({ createLogger: () => ({ error: state.loggerError }) }))
// oxlint-enable vitest/prefer-import-in-mock
vi.mock(import('ofetch'), async (importOriginal) => {
  const actual = await importOriginal()
  const fetchDouble = vi.fn<typeof actual.$fetch>()
  const fetchWithMethods = Object.assign(fetchDouble, actual.$fetch)

  return { ...actual, $fetch: fetchWithMethods }
})

let queryClient: ReturnType<typeof createAppQueryClient>
let app: ReturnType<typeof createApp>
const fetchMock = vi.mocked($fetch)
let stopWatching: () => void
let scopes: EffectScope[]

const firstChannel: TelegramChannelModel = { id: 1, chatId: 'first_channel', userId: 'alice', isVerified: true }
const secondChannel: TelegramChannelModel = { id: 2, chatId: 'second_channel', userId: 'alice', isVerified: true }
const channels = [firstChannel, secondChannel]
const notification: NotificationModel = { id: 10, isActive: true }
const firstDestination: NotificationDestinationModel = { id: 20, isActive: true, config: { type: 'telegram' } }
const secondDestination: NotificationDestinationModel = { id: 21, isActive: true, config: { type: 'telegram' } }

function setup<T extends object>(composable: () => T) {
  const scope = effectScope()

  scopes.push(scope)

  const value = app.runWithContext(() => scope.run(composable))

  if (value === undefined) {
    throw new Error('Composable scope did not run')
  }

  return { value, scope }
}

function httpError(status: number, message?: string) {
  const headers = new Headers()
  const response = new Response(null, { status })
  const error = new Error('Raw API error')

  if (message !== undefined) {
    Object.assign(response, { _data: { message } })
  }

  return createFetchError({
    request: '/api/test',
    options: { headers },
    response,
    error
  })
}

describe('query cache', () => {
  beforeEach(() => {
    state.user = reactive<typeof state.user>({ userId: 'alice' })
    scopes = []
    queryClient = createAppQueryClient(false)
    app = createApp({})
    app.use(VueQueryPlugin, { queryClient })
    stopWatching = watchQueryUser(queryClient, () => state.user.userId)
    fetchMock.mockReset()
    state.loggerError.mockClear()
  })

  afterEach(() => {
    for (const scope of scopes) {
      scope.stop()
    }

    stopWatching()
    queryClient.clear()
    vi.restoreAllMocks()
  })

  it('isolates application caches and applies the browser and server defaults', () => {
    const serverClient = createAppQueryClient(true)

    queryClient.setQueryData(telegramQueryKeys.channels(), channels)

    expect(serverClient.getQueryData(telegramQueryKeys.channels())).toBeUndefined()
    expect(queryClient.getDefaultOptions().queries).toStrictEqual({
      staleTime: 5000,
      gcTime: 300000,
      retry: false,
      networkMode: 'always',
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true
    })
    expect(queryClient.getDefaultOptions().mutations).toStrictEqual({
      gcTime: 300000, retry: false, networkMode: 'always'
    })
    expect(serverClient.getDefaultOptions().queries?.gcTime).toBe(Infinity)
    expect(serverClient.getDefaultOptions().mutations?.gcTime).toBe(Infinity)
    serverClient.clear()
  })

  describe('notification queries', () => {
    it('stores a missing notification as null but preserves other HTTP errors', async () => {
      fetchMock.mockRejectedValueOnce(httpError(404))

      const missing = await queryClient.query(getNotificationByType('stream.online'))

      expect(missing).toBeNull()
      expect(queryClient.getQueryData(notificationKeys.byEventType('stream.online'))).toBeNull()

      const failure = httpError(500)

      fetchMock.mockRejectedValueOnce(failure)

      const retry = queryClient.query({ ...getNotificationByType('stream.online'), staleTime: 0 })

      await expect(retry).rejects.toBe(failure)
      expect(queryClient.getQueryData(notificationKeys.byEventType('stream.online'))).toBeNull()
      expect(state.loggerError).toHaveBeenCalledWith('Failed to load query data', failure)

      const unrelatedError = new Error('Not an HTTP fetch error')

      Object.assign(unrelatedError, { statusCode: 404 })
      fetchMock.mockRejectedValueOnce(unrelatedError)

      const unrelatedRead = queryClient.query({ ...getNotificationByType('stream.online'), staleTime: 0 })

      await expect(unrelatedRead).rejects.toBe(unrelatedError)
    })

    it('switches the destination query when its reactive notification id changes', async () => {
      fetchMock.mockResolvedValueOnce([firstDestination]).mockResolvedValueOnce([secondDestination])

      const notificationId = ref(10)
      const { value: query } = setup(() => {
        const options = computed(() => ({ ...getByNotificationId(notificationId.value), enabled: true }))

        return useQuery(options)
      })

      await expect.poll(() => query.data.value).toStrictEqual([firstDestination])
      notificationId.value = 11
      await expect.poll(() => query.data.value).toStrictEqual([secondDestination])

      expect(queryClient.getQueryData(destinationKeys.byNotificationId(10))).toStrictEqual([firstDestination])
      expect(queryClient.getQueryData(destinationKeys.byNotificationId(11))).toStrictEqual([secondDestination])
      const [url, options] = fetchMock.mock.calls.at(-1) ?? []

      expect(url).toBe('/api/notifications/destinations')
      expect(options?.method).toBe('GET')
      expect(options?.query).toStrictEqual({ notificationId: 11 })
      expect(options?.signal).toBeInstanceOf(AbortSignal)
    })
  })

  describe('notification mutations', () => {
    it('creates a notification and replaces it with null after deletion', async () => {
      fetchMock.mockResolvedValueOnce(notification).mockResolvedValueOnce(null)

      const { value: create } = setup(useInitNotifications)
      const { value: remove } = setup(useDeleteNotification)

      await create.mutateAsync('stream.online')
      queryClient.setQueryData(destinationKeys.byNotificationId(10), [firstDestination])
      expect(queryClient.getQueryData(notificationKeys.byEventType('stream.online'))).toStrictEqual(notification)

      await remove.mutateAsync('stream.online')

      expect(queryClient.getQueryData(notificationKeys.byEventType('stream.online'))).toBeNull()
      expect(queryClient.getQueryState(destinationKeys.byNotificationId(10))).toBeUndefined()
    })

    it('cancels an old notification read before storing the deletion result', async () => {
      const read = Promise.withResolvers<NotificationModel>()

      fetchMock.mockReturnValueOnce(read.promise).mockResolvedValueOnce(null)
      queryClient.setQueryData(notificationKeys.byEventType('stream.online'), notification)
      const oldRead = queryClient.query({ ...getNotificationByType('stream.online'), staleTime: 0 })
      const { value: remove } = setup(useDeleteNotification)

      await remove.mutateAsync('stream.online')
      read.resolve(notification)
      await oldRead

      const [, options] = fetchMock.mock.calls[0] ?? []

      expect(options?.signal?.aborted).toBe(true)

      expect(queryClient.getQueryData(notificationKeys.byEventType('stream.online'))).toBeNull()
    })

    it('cancels a pending 404 read before storing a created notification', async () => {
      const read = Promise.withResolvers<NotificationModel>()
      const queryKey = notificationKeys.byEventType('stream.online')

      queryClient.setQueryData(queryKey, null)
      fetchMock.mockReturnValueOnce(read.promise).mockResolvedValueOnce(notification)
      const oldRead = queryClient.query({ ...getNotificationByType('stream.online'), staleTime: 0 })
      const { value: create } = setup(useInitNotifications)

      await create.mutateAsync('stream.online')
      read.reject(httpError(404))
      await oldRead

      const [, readOptions] = fetchMock.mock.calls[0] ?? []

      expect(readOptions?.signal?.aborted).toBe(true)
      expect(queryClient.getQueryData(queryKey)).toStrictEqual(notification)
    })

    it('keeps a recreated notification when the old deletion finishes later', async () => {
      const deletion = Promise.withResolvers<void>()
      const recreated: NotificationModel = { id: 11, isActive: true }
      const queryKey = notificationKeys.byEventType('stream.online')
      const oldDestinationsKey = destinationKeys.byNotificationId(10)
      const newDestinationsKey = destinationKeys.byNotificationId(11)

      queryClient.setQueryData(queryKey, notification)
      queryClient.setQueryData(oldDestinationsKey, [firstDestination])
      fetchMock.mockReturnValueOnce(deletion.promise)
        .mockRejectedValueOnce(httpError(404))
        .mockResolvedValueOnce(recreated)
      const { value: remove } = setup(useDeleteNotification)
      const { value: create } = setup(useInitNotifications)

      const pendingDeletion = remove.mutateAsync('stream.online')

      await expect.poll(() => fetchMock.mock.calls.length).toBe(1)
      await queryClient.query({ ...getNotificationByType('stream.online'), staleTime: 0 })
      expect(queryClient.getQueryData(queryKey)).toBeNull()
      await create.mutateAsync('stream.online')
      queryClient.setQueryData(newDestinationsKey, [secondDestination])
      deletion.resolve()
      await pendingDeletion

      expect(queryClient.getQueryData(queryKey)).toStrictEqual(recreated)
      expect(queryClient.getQueryState(oldDestinationsKey)).toBeUndefined()
      expect(queryClient.getQueryData(newDestinationsKey)).toStrictEqual([secondDestination])
    })

    it('keeps destination responses unique and refreshes the full list', async () => {
      const queryKey = destinationKeys.byNotificationId(10)

      queryClient.setQueryData(queryKey, [firstDestination, secondDestination])
      const { value: query } = setup(() => useQuery({ ...getByNotificationId(10), enabled: true }))
      const refresh = Promise.withResolvers<NotificationDestinationModel[]>()

      fetchMock.mockResolvedValueOnce(secondDestination).mockReturnValueOnce(refresh.promise)
      const { value: create } = setup(useCreateTelegramNotification)

      const pending = create.mutateAsync({ notificationId: 10, telegramChannelId: 1, message: 'Hello' })

      await expect.poll(() => fetchMock.mock.calls.length).toBe(2)
      expect(query.data.value).toStrictEqual([firstDestination, secondDestination])
      refresh.resolve([firstDestination, secondDestination])
      await pending
      expect(query.data.value).toStrictEqual([firstDestination, secondDestination])
    })

    it('loads every destination when creation finishes before the first list read', async () => {
      const read = Promise.withResolvers<NotificationDestinationModel[]>()

      fetchMock.mockReturnValueOnce(read.promise)
        .mockResolvedValueOnce(secondDestination)
        .mockResolvedValueOnce([firstDestination, secondDestination])

      const { value: query } = setup(() => useQuery({ ...getByNotificationId(10), enabled: true }))
      const { value: create } = setup(useCreateTelegramNotification)

      await create.mutateAsync({ notificationId: 10, telegramChannelId: 1, message: 'Hello' })
      read.resolve([firstDestination])
      await nextTick()

      expect(query.data.value).toStrictEqual([firstDestination, secondDestination])
      expect(fetchMock).toHaveBeenCalledTimes(3)
    })
  })

  describe('telegram channel mutations', () => {
    it('refreshes the shared channel list after adding a channel', async () => {
      queryClient.setQueryData(telegramQueryKeys.channels(), [firstChannel])
      const { value: query } = setup(() => useQuery({ ...getTelegramChannels(), enabled: true }))
      fetchMock.mockResolvedValueOnce(secondChannel).mockResolvedValueOnce(channels)
      const { value: add } = setup(useAddTelegramChannel)

      await add.mutateAsync('second_channel')

      expect(query.data.value).toStrictEqual(channels)
      expect(add.isPending.value).toBe(false)
    })

    it('replaces the first pending channel read after adding a channel', async () => {
      const read = Promise.withResolvers<TelegramChannelModel[]>()

      fetchMock.mockReturnValueOnce(read.promise)
        .mockResolvedValueOnce(secondChannel)
        .mockResolvedValueOnce([secondChannel])
      const { value: query } = setup(() => useQuery({ ...getTelegramChannels(), enabled: true }))
      const { value: add } = setup(useAddTelegramChannel)

      const pending = add.mutateAsync('second_channel')

      await expect.poll(() => fetchMock.mock.calls.length).toBe(3)
      read.resolve([])
      await pending
      await nextTick()

      const [, readOptions] = fetchMock.mock.calls[0] ?? []

      expect(readOptions?.signal?.aborted).toBe(true)
      expect(query.data.value).toStrictEqual([secondChannel])
      expect(add.isPending.value).toBe(false)
    })

    it('cancels the active read, blocks another deletion and stays pending through refetch', async () => {
      const read = Promise.withResolvers<TelegramChannelModel[]>()
      const deletion = Promise.withResolvers<unknown>()
      const refresh = Promise.withResolvers<TelegramChannelModel[]>()

      queryClient.setQueryData(telegramQueryKeys.channels(), channels)
      fetchMock.mockReturnValueOnce(read.promise).mockReturnValueOnce(deletion.promise).mockReturnValueOnce(refresh.promise)
      const { value: query } = setup(() => useQuery({ ...getTelegramChannels(), enabled: true }))
      const oldRead = query.refetch()
      const { value: first, scope } = setup(useDeleteTelegramChannel)
      const { value: second } = setup(useDeleteTelegramChannel)

      first.mutate(1)
      second.mutate(2)
      await expect.poll(() => queryClient.getQueryData(telegramQueryKeys.channels())).toStrictEqual([secondChannel])
      await oldRead

      const [, readOptions] = fetchMock.mock.calls[0] ?? []

      expect(readOptions?.signal?.aborted).toBe(true)
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(second.isPending.value).toBe(true)
      scope.stop()
      deletion.resolve(null)
      await expect.poll(() => fetchMock.mock.calls.length).toBe(3)
      expect(second.isPending.value).toBe(true)
      read.resolve(channels)
      refresh.resolve([secondChannel])
      await expect.poll(() => second.isPending.value).toBe(false)

      expect(query.data.value).toStrictEqual([secondChannel])
    })

    it('restores the removed channel after an error even when its scope is gone', async () => {
      const deletion = Promise.withResolvers<unknown>()
      const failure = httpError(500)

      queryClient.setQueryData(telegramQueryKeys.channels(), channels)
      fetchMock.mockReturnValueOnce(deletion.promise)
      const { value: remove, scope } = setup(useDeleteTelegramChannel)

      remove.mutate(1)
      await expect.poll(() => queryClient.getQueryData(telegramQueryKeys.channels())).toStrictEqual([secondChannel])
      scope.stop()
      deletion.reject(failure)
      await expect.poll(() => queryClient.getQueryData(telegramQueryKeys.channels())).toStrictEqual(channels)

      expect(queryClient.getQueryState(telegramQueryKeys.channels())?.isInvalidated).toBe(true)
      expect(state.loggerError).toHaveBeenCalledWith('Failed to update query data', failure)
    })
  })

  describe('query sessions', () => {
    it('clears query and mutation caches when the user changes', () => {
      const mutationCache = queryClient.getMutationCache()

      queryClient.setQueryData(telegramQueryKeys.channels(), channels)
      mutationCache.build(queryClient, { mutationKey: ['test'] })

      state.user.userId = null

      const queries = queryClient.getQueryCache()
      const remainingQueries = queries.getAll()
      const remainingMutations = mutationCache.getAll()

      expect(remainingQueries).toHaveLength(0)
      expect(remainingMutations).toHaveLength(0)
    })

    it('ignores a create response from a previous session of the same user', async () => {
      const response = Promise.withResolvers<NotificationModel>()

      fetchMock.mockReturnValueOnce(response.promise)
      const { value: create } = setup(useInitNotifications)
      const pending = create.mutateAsync('stream.online')

      await expect.poll(() => fetchMock.mock.calls.length).toBe(1)
      state.user.userId = null
      state.user.userId = 'alice'
      response.resolve(notification)
      await pending

      const cache = queryClient.getQueryCache()
      const remainingQueries = cache.getAll()

      expect(remainingQueries).toHaveLength(0)
    })

    it.each([
      {
        name: 'channel addition',
        launch: () => {
          const { value: add } = setup(useAddTelegramChannel)

          return add.mutateAsync('new_channel')
        }
      },
      {
        name: 'notification deletion',
        launch: () => {
          const { value: remove } = setup(useDeleteNotification)

          return remove.mutateAsync('stream.online')
        }
      },
      {
        name: 'destination creation',
        launch: () => {
          const { value: create } = setup(useCreateTelegramNotification)

          return create.mutateAsync({ notificationId: 10, telegramChannelId: 1, message: 'Hello' })
        }
      }
    ])('ignores late cache changes after $name in another session', async ({ launch }) => {
      const response = Promise.withResolvers<unknown>()

      queryClient.setQueryData(telegramQueryKeys.channels(), channels)
      queryClient.setQueryData(notificationKeys.byEventType('stream.online'), notification)
      queryClient.setQueryData(destinationKeys.byNotificationId(10), [firstDestination])
      fetchMock.mockReturnValueOnce(response.promise)
      const pending = launch()

      await expect.poll(() => fetchMock.mock.calls.length).toBe(1)
      state.user.userId = 'bob'
      queryClient.setQueryData(telegramQueryKeys.channels(), [secondChannel])
      queryClient.setQueryData(notificationKeys.byEventType('stream.online'), notification)
      queryClient.setQueryData(destinationKeys.byNotificationId(10), [firstDestination])
      // A successful response is enough to run the callback; its model must be ignored.
      response.resolve(secondDestination)
      await pending

      expect(queryClient.getQueryData(notificationKeys.byEventType('stream.online'))).toStrictEqual(notification)
      expect(queryClient.getQueryData(destinationKeys.byNotificationId(10))).toStrictEqual([firstDestination])
      expect(queryClient.getQueryState(telegramQueryKeys.channels())?.isInvalidated).toBe(false)
      expect(queryClient.getQueryState(destinationKeys.byNotificationId(10))?.isInvalidated).toBe(false)
    })

    it('does not restore old channels when a deletion fails after logout', async () => {
      const response = Promise.withResolvers<unknown>()

      queryClient.setQueryData(telegramQueryKeys.channels(), channels)
      fetchMock.mockReturnValueOnce(response.promise)
      const { value: remove } = setup(useDeleteTelegramChannel)

      remove.mutate(1)
      await expect.poll(() => fetchMock.mock.calls.length).toBe(1)
      state.user.userId = null
      response.reject(httpError(500))
      await expect.poll(() => remove.error.value).toBeInstanceOf(FetchError)

      const cache = queryClient.getQueryCache()
      const remainingQueries = cache.getAll()

      expect(remainingQueries).toHaveLength(0)
    })
  })

  describe('query feedback', () => {
    it('keeps recovery visible during retry and resets it for a new query key', async () => {
      const error = ref<Error | null>(new Error('Load failed'))
      const isFetching = ref(false)
      const queryKey = ref(['first'])
      const { value: feedback } = setup(() => useQueryFeedback({ error, isFetching, queryKey }))

      error.value = null
      isFetching.value = true
      await nextTick()
      expect(feedback.hasError.value).toBe(true)

      isFetching.value = false
      await nextTick()
      expect(feedback.hasError.value).toBe(false)

      error.value = new Error('Background refresh failed')
      await nextTick()
      expect(feedback.hasError.value).toBe(true)

      error.value = null
      isFetching.value = true
      queryKey.value = ['second']
      await nextTick()
      expect(feedback.hasError.value).toBe(false)
    })
  })

  describe('verification feedback', () => {
    it.each([
      {
        status: 400,
        message: 'Verification code not found or expired',
        expected: 'This code has expired or is missing. Send a new code, then try again.',
        needsNewCode: true
      },
      {
        status: 400,
        message: 'Invalid verification code',
        expected: 'Incorrect code. Wait one minute, then check the code and try again.',
        needsNewCode: false
      },
      {
        status: 429,
        message: 'Private server details',
        expected: 'Too many requests. Wait one minute before trying again.',
        needsNewCode: false
      },
      {
        status: 400,
        message: 'Private server details',
        expected: 'Could not verify the channel. Please try again.',
        needsNewCode: false
      },
      {
        status: 500,
        message: 'Private server details',
        expected: 'Could not verify the channel. Please try again.',
        needsNewCode: false
      }
    ])('offers safe recovery for verification $status: $message', ({ status, message, expected, needsNewCode }) => {
      const error = httpError(status, message)
      const feedback = getTelegramVerificationFeedback(error, 'verify')

      expect(feedback).toStrictEqual({ message: expected, needsNewCode })
    })

    it('offers a wait for rate-limited sending and safe retry for other send failures', () => {
      const rateLimit = httpError(429, 'Private server details')
      const failure = httpError(500, 'Private server details')
      const limitedFeedback = getTelegramVerificationFeedback(rateLimit, 'send-code')
      const failedFeedback = getTelegramVerificationFeedback(failure, 'send-code')

      expect(limitedFeedback.message).toBe('Too many requests. Wait one minute before trying again.')
      expect(failedFeedback.message).toBe('Could not send the verification code. Please try again.')
    })

    it('uses safe retry text for non-HTTP failures', () => {
      const error = new Error('Private connection details')
      const feedback = getTelegramVerificationFeedback(error, 'verify')

      expect(feedback).toStrictEqual({ message: 'Could not verify the channel. Please try again.', needsNewCode: false })
    })
  })
})
