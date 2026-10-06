import { FetchError } from 'ofetch'
import * as v from 'valibot'

interface VerificationFeedback {
  message: string;
  needsNewCode: boolean;
}

const errorResponseSchema = v.object({ message: v.string() })

// Only known API errors select recovery text; server messages are never displayed.
export function getTelegramVerificationFeedback(
  error: unknown,
  action: 'send-code' | 'verify'
): VerificationFeedback {
  if (error instanceof FetchError) {
    if (error.statusCode === 429) {
      return {
        message: 'Too many requests. Wait one minute before trying again.',
        needsNewCode: false
      }
    }

    if (action === 'verify' && error.statusCode === 400) {
      const response = v.safeParse(errorResponseSchema, error.data)
      const reason = response.success ? response.output.message : undefined

      if (reason === 'Verification code not found or expired') {
        return {
          message: 'This code has expired or is missing. Send a new code, then try again.',
          needsNewCode: true
        }
      }

      if (reason === 'Invalid verification code') {
        return {
          message: 'Incorrect code. Wait one minute, then check the code and try again.',
          needsNewCode: false
        }
      }
    }
  }

  const message = action === 'send-code'
    ? 'Could not send the verification code. Please try again.'
    : 'Could not verify the channel. Please try again.'

  return { message, needsNewCode: false }
}
