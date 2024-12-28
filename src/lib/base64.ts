/**
 * Base64 encoding based on https://github.com/denoland/std/tree/main/encoding (modified with url compatibility)
 * Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
 * https://github.com/denoland/std/blob/main/LICENSE
 *
 * https://github.com/unjs/h3/blob/4be78d70ce7eb0abd37143086d359dd535abf3d1/src/utils/internal/encoding.ts
 */

export const textEncoder = new TextEncoder()
export const textDecoder = new TextDecoder()

// ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_
const base64Code = [
  65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
  84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
  107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
  122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 45, 95,
]

export function base64Encode(data: ArrayBuffer | Uint8Array | string) : string {
  const buffer = validateBinaryLike(data)

  // Credits: https://gist.github.com/enepomnyaschih/72c423f727d395eeaa09697058238727
  const bytes: number[] = []
  let i
  const len = buffer.length

  for (i = 2; i < len; i += 3) {
    bytes.push(
      base64Code[buffer[i - 2]! >> 2],
      base64Code[((buffer[i - 2]! & 0x03) << 4) | (buffer[i - 1]! >> 4)],
      base64Code[((buffer[i - 1]! & 0x0f) << 2) | (buffer[i]! >> 6)],
      base64Code[buffer[i]! & 0x3f]
    )
  }

  if (i === len + 1) {
    // 1 octet yet to write
    bytes.push(
      base64Code[buffer[i - 2]! >> 2],
      base64Code[(buffer[i - 2]! & 0x03) << 4]
    )
  }

  if (i === len) {
    // 2 octets yet to write
    bytes.push(
      base64Code[buffer[i - 2]! >> 2],
      base64Code[((buffer[i - 2]! & 0x03) << 4) | (buffer[i - 1]! >> 4)],
      base64Code[(buffer[i - 1]! & 0x0f) << 2]
    )
  }

  return String.fromCharCode(...bytes)
}

export function base64Decode(b64Url: string) : Uint8Array {
  const b64 = b64Url.replace(/-/g, "+").replace(/_/g, "/")
  const binString = atob(b64)
  const size = binString.length
  const bytes = new Uint8Array(size)

  for (let i = 0; i < size; i++) {
    // (Uint8Array values are 0-255)

    bytes[i] = binString.charCodeAt(i)
  }

  return bytes
}

export function validateBinaryLike(source: unknown) : Uint8Array {
  if (typeof source === 'string') {
    return textEncoder.encode(source)
  }

  if (source instanceof Uint8Array) {
    return source
  }

  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source)
  }

  throw new TypeError(
    `The input must be a Uint8Array, a string, or an ArrayBuffer.`
  )
}
