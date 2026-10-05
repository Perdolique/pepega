import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter, type LocationQuery } from 'vue-router'
import { decodeStateData, encodeStateData } from '@pepega/twitch/auth'
import { getTwitchLoginUrl, resolveAuthRedirect } from '../router'

const rootRoute = {
  path: '/',
  fullPath: '/',
  query: {},
  hash: '',
  meta: {}
}

describe(resolveAuthRedirect, () => {
  it('allows guests to open the root sign-in page', () => {
    const redirect = resolveAuthRedirect(rootRoute, false)

    expect(redirect).toBeNull()
  })

  it('keeps the full protected destination for a guest', () => {
    const route = {
      path: '/account',
      fullPath: '/account?tab=telegram&from=setup#channels',
      query: { tab: 'telegram', from: 'setup' },
      hash: '#channels',
      meta: {}
    }

    const redirect = resolveAuthRedirect(route, false)

    expect(redirect).toStrictEqual({
      path: '/',
      query: { redirectTo: '/account?tab=telegram&from=setup#channels' }
    })
  })

  it.each([false, true])('preserves the legacy login query for authenticated=%s', (isAuthenticated) => {
    const route = {
      path: '/login',
      fullPath: '/login?redirectTo=%2Faccount&from=menu#sign-in',
      query: { redirectTo: '/account', from: 'menu' },
      hash: '#sign-in',
      meta: {}
    }

    const redirect = resolveAuthRedirect(route, isAuthenticated)

    expect(redirect).toStrictEqual({
      path: '/',
      query: { redirectTo: '/account', from: 'menu' },
      hash: '#sign-in'
    })
  })

  it('returns an authenticated user to the requested page', () => {
    const route = {
      path: '/',
      fullPath: '/?redirectTo=%2Faccount',
      query: { redirectTo: '/account?tab=telegram&from=setup#channels' },
      hash: '',
      meta: {}
    }

    const redirect = resolveAuthRedirect(route, true)

    expect(redirect).toBe('/account?tab=telegram&from=setup#channels')
  })

  it.each([
    undefined,
    null,
    '',
    '/',
    '/?redirectTo=/account',
    '/login?redirectTo=/account',
    '/LOGIN/',
    '/%6cogin',
    '/bad%path',
    'https://example.com/account',
    '//example.com/account',
    '/foo/..//example.com/account',
    String.raw`/\example.com/account`,
    ['/account', '/notifications']
  ])('uses the dashboard for an invalid or looping destination %s', (redirectTo) => {
    const query: LocationQuery = redirectTo === undefined ? {} : { redirectTo }
    const route = {
      path: '/',
      fullPath: '/',
      query,
      hash: '',
      meta: {}
    }

    const redirect = resolveAuthRedirect(route, true)

    expect(redirect).toBe('/dashboard')
  })

  it.each([false, true])('leaves the public callback accessible for authenticated=%s', (isAuthenticated) => {
    const route = {
      path: '/auth/twitch',
      fullPath: '/auth/twitch?code=test-code',
      query: { code: 'test-code' },
      hash: '',
      meta: { skipAuth: true }
    }

    const redirect = resolveAuthRedirect(route, isAuthenticated)

    expect(redirect).toBeNull()
  })

  it('allows an authenticated user to stay on a protected page', () => {
    const route = {
      path: '/account',
      fullPath: '/account',
      query: {},
      hash: '',
      meta: {}
    }

    const redirect = resolveAuthRedirect(route, true)

    expect(redirect).toBeNull()
  })
})

describe(getTwitchLoginUrl, () => {
  it('starts sign-in without a return destination', () => {
    const url = getTwitchLoginUrl(undefined)

    expect(url).toBe('/api/oauth/twitch')
  })

  it('encodes the complete return destination as one query value', () => {
    const destination = '/account?tab=telegram&from=setup#channels'
    const loginUrl = getTwitchLoginUrl(destination)
    const url = new URL(loginUrl, 'https://pepega.app')
    const redirectTo = url.searchParams.get('redirectTo')

    expect(url.pathname).toBe('/api/oauth/twitch')
    expect(redirectTo).toBe(destination)
    expect(url.searchParams.size).toBe(1)
    expect(url.hash).toBe('')
  })

  it('restores the fragment inherited from an HTTP guest redirect', () => {
    const loginUrl = getTwitchLoginUrl('/account?tab=telegram&from=setup', '#channels')
    const url = new URL(loginUrl, 'https://pepega.app')
    const redirectTo = url.searchParams.get('redirectTo')

    expect(redirectTo).toBe('/account?tab=telegram&from=setup#channels')
    expect(url.hash).toBe('')
  })

  it('keeps an explicit return fragment ahead of an inherited fragment', () => {
    const loginUrl = getTwitchLoginUrl('/account#notifications', '#channels')
    const url = new URL(loginUrl, 'https://pepega.app')
    const redirectTo = url.searchParams.get('redirectTo')

    expect(redirectTo).toBe('/account#notifications')
  })

  it('keeps a decoded Unicode route fragment compatible with OAuth state', () => {
    const history = createMemoryHistory()
    const router = createRouter({
      history,
      routes: [{ path: '/', component: {} }]
    })
    const route = router.resolve('/?redirectTo=/account#%F0%9F%8D%8E-%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB%D1%8B')
    const expectedDestination = '/account#%F0%9F%8D%8E-%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB%D1%8B'

    const loginUrl = getTwitchLoginUrl(route.query.redirectTo, route.hash)
    const url = new URL(loginUrl, 'https://pepega.app')
    const redirectTo = url.searchParams.get('redirectTo')
    const stateData = { redirectTo: redirectTo ?? '' }
    const encodedState = encodeStateData(stateData)
    const decodedState = decodeStateData(encodedState)

    expect(redirectTo).toBe(expectedDestination)
    expect(decodedState).toStrictEqual({ redirectTo: expectedDestination })
    expect(url.hash).toBe('')
  })

  it('ignores an entry fragment when no return destination exists', () => {
    const loginUrl = getTwitchLoginUrl(undefined, '#sign-in')

    expect(loginUrl).toBe('/api/oauth/twitch')
  })

  it.each([
    '/login?redirectTo=/',
    '/foo/..//example.com/account'
  ])('replaces an unsafe OAuth return with the dashboard: %s', (destination) => {
    const loginUrl = getTwitchLoginUrl(destination)
    const url = new URL(loginUrl, 'https://pepega.app')
    const redirectTo = url.searchParams.get('redirectTo')

    expect(redirectTo).toBe('/dashboard')
  })
})
