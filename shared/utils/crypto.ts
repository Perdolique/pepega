import { Buffer } from 'node:buffer'
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // GCM recommends 12 bytes for IV
const AUTH_TAG_LENGTH = 16 // GCM always uses 16 bytes for auth tag

function createKey(key: string) : Buffer {
  return Buffer.from(key.padEnd(32).slice(0, 32))
}

export async function encrypt(data: string, key: string) : Promise<string> {
  const keyBuffer = createKey(key)
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, keyBuffer, iv)

  const encrypted = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final()
  ])

  const authTag = cipher.getAuthTag()

  return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

export async function decrypt(encryptedData: string, key: string) : Promise<string> {
  const keyBuffer = createKey(key)
  const buffer = Buffer.from(encryptedData, 'base64')

  if (buffer.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid encrypted data length')
  }

  const iv = buffer.subarray(0, IV_LENGTH)
  const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
  const encrypted = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

  const decipher = createDecipheriv(ALGORITHM, keyBuffer, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]).toString('utf8')
}
