interface VerifyEventMessageParams {
  messageId: string;
  messageTimestamp: string;
  bodyString: string;
  messageSignature: string;
  secret: string;
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

  // Compare the signatures using timingSafeEqual
  if (calculatedBuffer.length !== signatureBuffer.length) {
    return false
  }

  return crypto.subtle.timingSafeEqual(calculatedBuffer, signatureBuffer)
}