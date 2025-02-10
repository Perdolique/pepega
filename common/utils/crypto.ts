import { Buffer } from 'buffer'

const ALGORITHM = 'AES-GCM'
const IV_LENGTH = 12
const KEY_LENGTH = 32

async function getKey(password: string) : Promise<CryptoKey> {
  const key = password.padEnd(KEY_LENGTH).slice(0, KEY_LENGTH)
  const keyData = Buffer.from(key)

  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encrypt(data: string, password: string) : Promise<string> {
  const key = await getKey(password)
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    Buffer.from(data)
  )

  return Buffer.concat([
    Buffer.from(iv),
    Buffer.from(encrypted)
  ]).toString('base64')
}

export async function decrypt(encryptedData: string, password: string) : Promise<string> {
  const key = await getKey(password)
  const buffer = Buffer.from(encryptedData, 'base64')

  if (buffer.length < IV_LENGTH) {
    throw new Error('Invalid encrypted data length')
  }

  const iv = buffer.subarray(0, IV_LENGTH)
  const encrypted = buffer.subarray(IV_LENGTH)

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted
  )

  return Buffer.from(decrypted).toString()
}
