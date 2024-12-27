import { subtle } from 'uncrypto'
import { env } from '$env/dynamic/private'

// Requires nodejs_compat
// https://developers.cloudflare.com/workers/runtime-apis/nodejs/#built-in-nodejs-runtime-apis
import { Buffer } from 'node:buffer'

/**
 * Creates an HMAC key from SESSION_SECRET for signing data
 */
async function getKey() {
  try {
    const encoder = new TextEncoder()
    const keyMaterial = encoder.encode(env.SESSION_SECRET)

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

  return Buffer.from(array).toString('base64')
}

/**
 * Signs data and creates a token in format: base64(data).base64(signature)
 */
export async function sign<S>(sessionData: S): Promise<string> {
  const timestamp = Date.now()
  const nonce = generateNonce()
  const encoder = new TextEncoder()

  // Prepare payload with timestamp and nonce
  const payload = {
    sessionData,
    timestamp,
    nonce
  }

  // Convert to base64
  const payloadBytes = encoder.encode(JSON.stringify(payload))
  const payloadBase64 = Buffer.from(payloadBytes).toString('base64')

  // Sign payload
  const key = await getKey()

  if (key === undefined) {
    throw new Error('Failed to get key for signing')
  }

  const signatureBytes = await subtle.sign(
    'HMAC',
    key,
    payloadBytes
  )

  const signatureBase64 = Buffer.from(signatureBytes).toString('base64')

  // Return in JWT-like format
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
    const payloadBytes = Buffer.from(payloadBase64, 'base64')
    const signatureBytes = Buffer.from(signatureBase64, 'base64')

    // Verify signature
    const key = await getKey()

    if (key === undefined) {
      return null
    }

    const isValid = await subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      payloadBytes
    )

    if (isValid === false) {
      return null
    }

    // Parse payload
    const payloadString = new TextDecoder().decode(payloadBytes)
    const { sessionData } = JSON.parse(payloadString)

    return sessionData
  } catch {
    return null
  }
}
