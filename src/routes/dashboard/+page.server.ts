import { redirect } from '@sveltejs/kit'
import { deleteSession } from '$lib/session'
import type { Actions } from './$types'
import { redirectUrlParam } from '$lib/constants'

export function load({ locals, url }) {
  if (locals.userId === undefined) {
    return redirect(307, `/login?${redirectUrlParam}=${url.pathname}`)
  }

  return {
    userId: locals.userId
  }
}

export const actions = {
  logout: async (event) => {
    deleteSession(event)

    return redirect(307, '/login')
  }
} satisfies Actions
