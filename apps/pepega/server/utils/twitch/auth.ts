import { getAppAccessToken } from '@pepega/twitch/auth'
import { decrypt, encrypt } from '@pepega/utils/crypto'
import { kvStorageKeys, kvStorageName } from '~~/constants'

export async function getStoredToken(encryptionKey: string) : Promise<string | null> {
  const storage = useStorage(kvStorageName)
  const encryptedStoredToken = await storage.getItem<string>(kvStorageKeys.twitchAppAccessToken)

  if (encryptedStoredToken === null) {
    return null
  }

  try {
    return await decrypt(encryptedStoredToken, encryptionKey)
  } catch {
    logger.error('Failed to decrypt stored token')

    return null
  }
}

/**
 * Gets the app access token from KV storage or requests a new one from Twitch
 *
 * Safe expiration time calculation 🕒:
 * - Tokens valid > 1h: expires_in - 1h
 * - Tokens valid < 1h: expires_in * 0.9
 */
export async function obtainTwitchAppToken(encryptionKey: string) {
  const existingToken = await getStoredToken(encryptionKey)
  const clientId = getValidatedTwitchClientId()
  const clientSecret = getValidatedTwitchClientSecret()

  if (existingToken !== null) {
    return existingToken
  }

  // Get new app access token
  const tokenResponse = await getAppAccessToken({ clientId, clientSecret })

  if (tokenResponse === null) {
    throw new Error('Failed to obtain app access token')
  }

  const storage = useStorage(kvStorageName)
  const encryptedToken = await encrypt(tokenResponse.access_token, encryptionKey)

  // Calculate safe expiration time - either 1 hour less or 10% less
  const ONE_HOUR = 3600

  const safeExpirationTime = tokenResponse.expires_in > ONE_HOUR
    ? tokenResponse.expires_in - ONE_HOUR  // Subtract 1 hour for longer-lived tokens
    : Math.floor(tokenResponse.expires_in * 0.9)  // Subtract 10% for shorter-lived tokens

  await storage.setItem(kvStorageKeys.twitchAppAccessToken, encryptedToken, {
    expirationTtl: safeExpirationTime
  })

  return tokenResponse.access_token
}
