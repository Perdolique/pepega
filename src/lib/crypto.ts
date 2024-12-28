import { subtle } from 'uncrypto'
import { env } from '$env/dynamic/private'
import { base64Encode, base64Decode, textEncoder, textDecoder } from './base64'

/**
 * Creates an HMAC key from SESSION_SECRET for signing data
 */
async function getKey() {
  try {
    const keyMaterial = textEncoder.encode(env.SESSION_SECRET)

    return await subtle.importKey(
      'raw',
      keyMaterial,
      {
        name: 'HMAC',
        hash: 'SHA-256'
      },
      false,
      ['sign', 'verify']
    )
  } catch (error) {
    const customError = new Error('Signing initialization failed', { cause: error })

    console.error('Signing initialization failed', customError)
  }
}

/**
 * Creates random nonce for unique tokens
 */
function generateNonce(): string {
  const array = new Uint8Array(8)
  crypto.getRandomValues(array)

  return base64Encode(array)
}

/**
 * Signs data and creates a token in format: base64(data).base64(signature)
 */
export async function sign<S>(sessionData: S): Promise<string> {
  const timestamp = Date.now()
  const nonce = generateNonce()

  // Prepare payload with timestamp and nonce
  const payload = {
    sessionData,
    timestamp,
    nonce
  }

  // Prepare strings for signing
  const payloadString = JSON.stringify(payload)
  const payloadBase64 = base64Encode(payloadString)
  const signPayload = textEncoder.encode(payloadString)

  // Sign payload
  const key = await getKey()

  if (key === undefined) {
    throw new Error('Failed to get key for signing')
  }

  const signatureBytes = await subtle.sign(
    'HMAC',
    key,
    signPayload
  )

  const signatureBase64 = base64Encode(signatureBytes)

  return `${payloadBase64}.${signatureBase64}`
}

/**
 * Verifies token and returns session data
 */
export async function verify<S>(token: string): Promise<S | null> {
  try {
    const [payloadBase64, signatureBase64] = token.split('.')

    if (payloadBase64 === undefined || signatureBase64 === undefined) {
      return null
    }

    // Decode payload
    const payloadBytes = base64Decode(payloadBase64)
    const payloadString = textDecoder.decode(payloadBytes)
    const signPayload = textEncoder.encode(payloadString)
    const signatureBytes = base64Decode(signatureBase64)

    // Verify signature
    const key = await getKey()

    if (key === undefined) {
      return null
    }

    const isValid = await subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      signPayload
    )

    if (isValid === false) {
      return null
    }

    // Parse payload
    const { sessionData } = JSON.parse(payloadString)

    return sessionData
  } catch {
    return null
  }
}
