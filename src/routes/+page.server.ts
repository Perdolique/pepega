import { fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { createSession } from '$lib/session'

export const load : PageServerLoad = function (event) {
  const { userId } = event.locals
  const isAuthorized = userId !== undefined

  return {
    isAuthorized,
    userId
  }
}

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
