const ALGORITHM = 'AES-GCM'
const IV_LENGTH = 12
const KEY_LENGTH = 32
const encoder = new TextEncoder()
const decoder = new TextDecoder()

async function getKey(password: string) : Promise<CryptoKey> {
  const key = password.padEnd(KEY_LENGTH).slice(0, KEY_LENGTH)
  const keyData = encoder.encode(key)

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
  const encodedData = encoder.encode(data)

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encodedData
  )

  const result = new Uint8Array(iv.length + new Uint8Array(encrypted).length)
  result.set(iv)
  result.set(new Uint8Array(encrypted), iv.length)

  return btoa(String.fromCharCode(...result))
}

export async function decrypt(encryptedData: string, password: string) : Promise<string> {
  const key = await getKey(password)
  const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))

  if (data.length < IV_LENGTH) {
    throw new Error('Invalid encrypted data length')
  }

  const iv = data.slice(0, IV_LENGTH)
  const encrypted = data.slice(IV_LENGTH)

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted
  )

  return decoder.decode(decrypted)
}
