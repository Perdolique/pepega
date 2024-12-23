import type { Handle, RequestEvent } from '@sveltejs/kit'

interface SessionData {
  userId: string;
}

const tokenName = 'pepeger'

const cookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax'
} as const

function getExpirationDate() {
  // 7 days
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
}

function getSessionToken(event: RequestEvent) {
  return event.cookies.get(tokenName)
}

/**
 * Creates a session token and stores it in a cookie
 */
export function createSession(event: RequestEvent, sessionData: SessionData) : SessionData | null {
  const existingToken = getSessionToken(event)

  if (existingToken !== undefined) {
    console.log('SESSION: createSession: session already exists')

    return null
  }

  console.log(`SESSION: createSession: ${sessionData.userId}`)

  const token = btoa(JSON.stringify(sessionData))
  const expirationDate = getExpirationDate()

  event.cookies.set(tokenName, token, {
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
    console.log('SESSION: deleteSession: no session to delete')

    return
  }

  const expirationDate = new Date(0)

  console.log('SESSION: deleteSession')

  event.cookies.set(tokenName, '', {
    ...cookieOptions,
    expires: expirationDate
  })
}

/**
 * Returns the session data if the token is valid
 * 
 * @param token - base64 encoded JSON string
 */
export function getSessionData(token: string) : SessionData | null {
  try {
    const sessionDataString = atob(token)
    const sessionData : unknown = JSON.parse(sessionDataString)

    // TODO: Valibot?
    if (
      typeof sessionData === 'object' && 
      sessionData !== null &&
      'userId' in sessionData &&
      typeof sessionData.userId === 'string'
    ) {
      console.log(`SESSION: getSessionData: ${sessionData.userId}`)

      return {
        userId: sessionData.userId
      }
    }
  } catch {
    // Do nothing
  }
  
  console.log('SESSION: getSessionData: invalid token')

  return null
}

/**
 * Updates `event.locals` based on the session data
 */
export const handleSession : Handle = async ({ event, resolve }) => {
  const sessionToken = getSessionToken(event)

  if (sessionToken === undefined) {
    console.log('SESSION: handleSession: no token')

    event.locals.userId = undefined
  } else {
    const sessionData = getSessionData(sessionToken)

    if (sessionData === null) {
      console.log('SESSION: handleSession: invalid token')

      event.locals.userId = undefined
    } else {
      console.log(`SESSION: handleSession: ${sessionData.userId}`)

      event.locals.userId = sessionData.userId
    }
  }

  return resolve(event)
}