import type { LocationQueryValue, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

type AuthRoute = Pick<RouteLocationNormalized, 'path' | 'fullPath' | 'query' | 'meta' | 'hash'>
type ReturnDestination = LocationQueryValue | LocationQueryValue[] | undefined

function normalizeEntryPath(path: string) {
  const lowercasePath = path.toLowerCase()
  const normalizedPath = lowercasePath.replace(/\/+$/u, '')
  const entryPath = normalizedPath || '/'

  return entryPath
}

function getReturnPath(destination: ReturnDestination, inheritedHash = '') {
  if (typeof destination !== 'string') {
    return '/dashboard'
  }

  const isRootRelative = destination.startsWith('/')

  if (!isRootRelative) {
    return '/dashboard'
  }

  try {
    const url = new URL(destination, 'https://pepega.invalid')
    const decodedPath = decodeURIComponent(url.pathname)
    const entryPath = normalizeEntryPath(decodedPath)
    const isProtocolRelativePath = url.pathname.startsWith('//')
    const isSignInEntry = entryPath === '/' || entryPath === '/login'
    const isInvalidDestination = url.origin !== 'https://pepega.invalid' || isProtocolRelativePath || isSignInEntry

    if (isInvalidDestination) {
      return '/dashboard'
    }

    const shouldRestoreHash = url.hash === '' && inheritedHash !== ''

    if (shouldRestoreHash) {
      // URL.hash percent-encodes Unicode for the existing base64 OAuth state.
      url.hash = inheritedHash
    }

    const returnPath = `${url.pathname}${url.search}${url.hash}`

    return returnPath
  } catch {
    return '/dashboard'
  }
}

// Owns the canonical sign-in route and return destinations for the auth middleware.
export function resolveAuthRedirect(to: AuthRoute, isAuthenticated: boolean) : RouteLocationRaw | null {
  const entryPath = normalizeEntryPath(to.path)

  if (entryPath === '/login') {
    return {
      path: '/',
      query: to.query,
      hash: to.hash
    }
  }

  if (to.meta.skipAuth === true) {
    return null
  }

  if (isAuthenticated) {
    if (entryPath === '/') {
      const returnPath = getReturnPath(to.query.redirectTo)

      return returnPath
    }

    return null
  }

  if (entryPath !== '/') {
    return {
      path: '/',
      query: {
        redirectTo: to.fullPath
      }
    }
  }

  return null
}

export function getTwitchLoginUrl(destination: ReturnDestination, inheritedHash = '') {
  if (destination === undefined || destination === null) {
    return '/api/oauth/twitch'
  }

  const redirectTo = getReturnPath(destination, inheritedHash)
  const query = new URLSearchParams({ redirectTo })
  const queryString = query.toString()
  const loginUrl = `/api/oauth/twitch?${queryString}`

  return loginUrl
}
