import { handleSession } from '$lib/session'

export async function handle(input) {
  return await handleSession(input)
}
