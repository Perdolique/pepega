import { clearSession, getSession, updateSession, useSession, type RequestEvent, type SessionConfig } from 'nuxt/server'
import { sessionCookieName } from '~~/constants';

type SessionData = {
  userId?: string | null;
  isAdmin?: boolean;
  lastAdminCheck?: string;
}

function getSessionConfig() {
  return {
    // TODO: use env validator
    password: process.env.SESSION_SECRET ?? '',
    name: sessionCookieName,
    maxAge: 60 * 60 * 24 * 7, // 1 week

    cookie: {
      sameSite: 'strict',
      httpOnly: true,
      secure: true
    }
  } satisfies SessionConfig
}

export async function useAppSession(event: RequestEvent) {
  const config = getSessionConfig()

  return useSession<SessionData>(event, config)
}

export async function getAppSession(event: RequestEvent) {
  const config = getSessionConfig()

  return await getSession<SessionData>(event, config)
}

export async function updateAppSession(event: RequestEvent, data: SessionData) {
  const config = getSessionConfig()

  return updateSession(event, config, data)
}

export async function clearAppSession(event: RequestEvent) {
  const config = getSessionConfig()

  return clearSession(event, config)
}
