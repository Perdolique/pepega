import { ofetch } from 'ofetch'
import type { AppTokenResponse } from './models'
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
    // TODO: check tags feature
    logger.error('Failed to get app access token', error)

    return null
  }
}
