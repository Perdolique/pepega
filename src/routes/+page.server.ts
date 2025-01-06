import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { createSession } from '$lib/session'

export const actions = {
  login: async (event) => {
    const sessionData = await createSession(event, {
      userId: 'USER_ID'
    })

    if (sessionData === null) {
      return fail(401, {
        error: 'Unauthorized'
      })
    }

    return {
      error: null
    }
  }
} satisfies Actions
