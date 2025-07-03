import * as v from 'valibot'
import { ofetch } from 'ofetch'
import type { AppTokenResponse, OAuthTokenResponse, User, UsersResponse } from './models/general'
import logger from './logger'

interface VerifyEventMessageParams {
  messageId: string;
  messageTimestamp: string;
  bodyString: string;
  messageSignature: string;
  secret: string;
}

interface AppAccessTokenParams {
  clientId: string;
  clientSecret: string;
}

interface UserInfoParams {
  clientId: string;
  /** App access token or user access token */
  accessToken: string;
}

interface OAuthTokenParams {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface AuthUrlParams {
  clientId: string;
  redirectUri: string;
  /** Optional state data to maintain user state across redirects. It will not be modified. */
  stateData?: Record<string, string>;
}

const stateDataSchema = v.object({
  redirectTo: v.string()
})

/**
 * Performs a cryptographically secure comparison of two Uint8Array buffers
 * using XOR operation to prevent timing attacks
 */
function safeCompare(leftBuffer: Uint8Array, rightBuffer: Uint8Array) : boolean {
  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  let differenceAccumulator = 0;
  for (let index = 0; index < leftBuffer.length; index++) {
    const leftByte = leftBuffer[index] === undefined ? 0 : leftBuffer[index]
    const rightByte = rightBuffer[index] === undefined ? 0 : rightBuffer[index]

    if (leftByte !== undefined && rightByte !== undefined) {
      // XOR operation will result in 0 only if bits are identical
      differenceAccumulator |= leftByte ^ rightByte
    } else {
      differenceAccumulator++;
    }
  }

  return differenceAccumulator === 0
}

export async function verifyEventMessage(params: VerifyEventMessageParams) {
  const encoder = new TextEncoder()
  const testString = `${params.messageId}${params.messageTimestamp}${params.bodyString}`
  const keyData = encoder.encode(params.secret)
  const messageData = encoder.encode(testString)

  const hmacKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'HMAC',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )

  const calculatedSignature = await crypto.subtle.sign('HMAC', hmacKey, messageData)

  // Convert the signature to hex and add sha256= prefix to match Twitch format
  const calculatedSignatureHex = `sha256=${Array.from(new Uint8Array(calculatedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')}`

  // Convert both signatures to Uint8Array for comparison
  const calculatedBuffer = encoder.encode(calculatedSignatureHex)
  const signatureBuffer = encoder.encode(params.messageSignature)

  return safeCompare(calculatedBuffer, signatureBuffer);
}

export async function getAppAccessToken({ clientId, clientSecret }: AppAccessTokenParams) : Promise<AppTokenResponse | null> {
  try {
    const response = await ofetch<AppTokenResponse>('https://id.twitch.tv/oauth2/token', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })

    return response
  } catch (error) {
    logger.error('Failed to get app access token', error)

    return null
  }
}

/**
 * Fetches Twitch user info using the provided access token
 *
 * @see https://dev.twitch.tv/docs/api/reference/#get-users
 */
export async function getUserInfo({ clientId, accessToken } : UserInfoParams) : Promise<User[] | null> {
  try {
    const response = await ofetch<UsersResponse>('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-ID': clientId
      }
    })

    if ('error' in response) {
      return null
    }

    return response.data
  } catch (error) {
    logger.error('Failed to get Twitch user info', error)

    // TODO: handle errors properly

    return null
  }
}

/**
 * Fetches OAuth token using the provided code
 *
 * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-authorization-code-flow
 */
export async function getOAuthToken(params: OAuthTokenParams) : Promise<string | null> {
  const {
    code,
    clientId,
    clientSecret,
    redirectUri
  } = params

  try {
    const response = await ofetch<OAuthTokenResponse>('https://id.twitch.tv/oauth2/token', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }
    })

    if ('status' in response) {
      logger.error('Failed to get OAuth token:', response)

      throw new Error(response.message)
    }

    return response.access_token
  } catch (error) {
    logger.error('Failed to get OAuth token', error)

    return null
  }
}

/**
 * Encode state data to be passed to the Twitch authentication URL
 *
 * @param data - Data to be passed to the state parameter. This data will be sent back to the redirect URI after authentication as is.
 * @returns Base64 encoded string of the state data
 */
export function encodeStateData(data: Record<string, string>) : string {
  const stateString = JSON.stringify(data)

  return btoa(stateString)
}


export function decodeStateData(state: unknown) {
  try {
    if (typeof state !== 'string') {
      return null
    }

    const stateString = atob(state)
    const data = JSON.parse(stateString)
    const stateData = v.parse(stateDataSchema, data)

    return stateData
  } catch (error) {
    return null
  }
}

/**
 * Get the URL to redirect the user to for Twitch authentication
 *
 * @param stateData - Data to be passed to the state parameter. This data will be sent back to the redirect URI after authentication as is.
 * @returns The URL to redirect the user to
 */
export function getAuthUrl({ stateData, clientId, redirectUri } : AuthUrlParams) : string {
  const authUrl = new URL('https://id.twitch.tv/oauth2/authorize')

  // TODO: Add `state` to prevent CSRF attacks
  // https://github.com/Perdolique/pepega/issues/28

  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')

  if (stateData !== undefined) {
    const state = encodeStateData(stateData)

    authUrl.searchParams.set('state', state)
  }

  return authUrl.toString()
}
