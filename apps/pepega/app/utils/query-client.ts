import { MutationCache, QueryCache, QueryClient } from '@tanstack/vue-query'
import { createLogger } from '@pepega/utils/logger'
import { watch, type WatchSource } from 'vue'

export interface QueryUserContext {
  userId: string | null;
  session: symbol;
}

const querySessions = new WeakMap<QueryClient, symbol>()
const logger = createLogger('PEPEGA')

export function createAppQueryClient(isServer: boolean) {
  const gcTime = isServer ? Infinity : 300000

  return new QueryClient({
    queryCache: new QueryCache({
      onError(error) {
        logger.error('Failed to load query data', error)
      }
    }),
    mutationCache: new MutationCache({
      onError(error) {
        logger.error('Failed to update query data', error)
      }
    }),
    defaultOptions: {
      queries: {
        staleTime: 5000,
        gcTime,
        retry: false,
        networkMode: 'always',
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
      },
      mutations: {
        gcTime,
        retry: false,
        networkMode: 'always'
      }
    }
  })
}

// A new session also rejects late callbacks when the same user signs in again.
export function watchQueryUser(queryClient: QueryClient, userId: WatchSource<string | null>) {
  return watch(userId, () => {
    querySessions.set(queryClient, Symbol('query-session'))
    queryClient.clear()
  }, { flush: 'sync' })
}

export function captureQueryUser(queryClient: QueryClient, userId: string | null): QueryUserContext {
  let session = querySessions.get(queryClient)

  if (session === undefined) {
    session = Symbol('query-session')
    querySessions.set(queryClient, session)
  }

  return { userId, session }
}

export function isCurrentQueryUser(
  queryClient: QueryClient,
  context: QueryUserContext | undefined,
  userId: string | null
) {
  return context !== undefined &&
    context.userId === userId &&
    context.session === querySessions.get(queryClient)
}
