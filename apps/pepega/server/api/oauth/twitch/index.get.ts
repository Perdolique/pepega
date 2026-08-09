import { getTwitchRedirectUri } from '~~/server/utils/provider-twitch';
import { getValidatedTwitchClientId } from '~~/server/utils/validation';
import { getQuery, defineEventHandler, sendRedirect } from 'h3';
import { getAuthUrl } from '@pepega/twitch/auth';

export default defineEventHandler((event) => {
  // TODO: Check if the user is already logged in and linked their account
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ

  const clientId = getValidatedTwitchClientId();
  const { redirectTo } = getQuery(event);
  const stateData = typeof redirectTo === 'string' ? { redirectTo } : undefined;
  const redirectUri = getTwitchRedirectUri(event);

  const redirectUrl = getAuthUrl({
    stateData,
    clientId,
    redirectUri,
  });

  void sendRedirect(event, redirectUrl);
});
