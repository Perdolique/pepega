import {
  clearSession,
  getSession,
  updateSession,
  useSession,
  type H3Event,
  type EventHandlerRequest,
  type SessionConfig,
} from 'h3';
import { sessionCookieName } from '~~/constants';

interface SessionData {
  userId: string | null;
  isAdmin: boolean;
  lastAdminCheck?: string;
}

function getSessionConfig(): SessionConfig {
  return {
    // TODO: use env validator
    password: process.env.SESSION_SECRET ?? '',
    name: sessionCookieName,

    cookie: {
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  };
}

async function useAppSession(event: H3Event<EventHandlerRequest>) {
  const config = getSessionConfig();

  return useSession<SessionData>(event, config);
}

async function getAppSession(event: H3Event<EventHandlerRequest>) {
  const config = getSessionConfig();

  return getSession<SessionData>(event, config);
}

async function updateAppSession(event: H3Event<EventHandlerRequest>, data: SessionData) {
  const config = getSessionConfig();

  return updateSession(event, config, data);
}

async function clearAppSession(event: H3Event<EventHandlerRequest>) {
  const config = getSessionConfig();

  return clearSession(event, config);
}

export { useAppSession, getAppSession, updateAppSession, clearAppSession };
