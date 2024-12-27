import { sign, verify } from '$lib/crypto';
import type { Handle, RequestEvent } from '@sveltejs/kit';

interface SessionData {
  userId: string;
}

const SESSION_TOKEN_NAME = 'pepeger'

// `secure` flag is enabled by default in production
const cookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax'
} as const

function authorize(event: RequestEvent, sessionData: SessionData) {
  event.locals.userId = sessionData.userId
}

function unauthorize(event: RequestEvent) {
  event.locals.userId = undefined
}

function getExpirationDate() {
  // 7 days
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
}

function getSessionToken(event: RequestEvent) {
  return event.cookies.get(SESSION_TOKEN_NAME)
}

/**
 * Creates a session token and stores it in a cookie
 */
export async function createSession(event: RequestEvent, sessionData: SessionData) : Promise<SessionData | null> {
  const token = await sign<SessionData>(sessionData)
  const expirationDate = getExpirationDate()

  event.cookies.set(SESSION_TOKEN_NAME, token, {
    ...cookieOptions,
    expires: expirationDate
  })

  return sessionData
}

/**
 * Deletes the session cookie
 */
export function deleteSession(event: RequestEvent) {
  const existingToken = getSessionToken(event)

  if (existingToken === undefined) {
    return
  }

  const expirationDate = new Date(0)

  event.cookies.set(SESSION_TOKEN_NAME, '', {
    ...cookieOptions,
    expires: expirationDate
  })
}

/**
 * Returns the session data if the token is valid
 */
export async function getSessionData(token: string) : Promise<SessionData | null> {
  try {
    const sessionData = await verify<SessionData>(token)

    if (typeof sessionData?.userId === 'string') {
      return sessionData
    }
  } catch {
    console.warn('Invalid session token')
  }

  return null
}

/**
 * Updates `event.locals` based on the session data
 */
export const handleSession : Handle = async ({ event, resolve }) => {
  const sessionToken = getSessionToken(event)

  if (sessionToken === undefined) {
    unauthorize(event)

    return resolve(event)
  }

  const sessionData = await getSessionData(sessionToken)

  if (sessionData === null) {
    unauthorize(event)

    return resolve(event)
  }

  authorize(event, sessionData)

  return resolve(event)
}
