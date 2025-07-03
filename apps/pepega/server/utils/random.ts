export function getRandomCode(codeLength: number = 6): string {
  if (codeLength < 1) {
    throw new Error('Code length must be greater than 0')
  }

  if (codeLength > 10) {
    throw new Error('Code length must be less than or equal to 10')
  }

  const randomBuffer = new Uint32Array(1)

  crypto.getRandomValues(randomBuffer)

  const bufferValue = randomBuffer[0] ?? 0
  const randomNumber = bufferValue / (0xFFFFFFFF + 1)
  const min = 10 ** (codeLength - 1)
  const max = 10 ** codeLength
  const range = max - min
  const codeValue = Math.floor(randomNumber * range) + min;
  const code = codeValue.toString().padStart(codeLength, '0')

  return code
}
