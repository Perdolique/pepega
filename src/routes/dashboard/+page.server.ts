import { redirect } from '@sveltejs/kit'
import { deleteSession } from '$lib/session'
import type { Actions } from './$types'

export function load({ locals, url }) {
  if (locals.userId === undefined) {
    return redirect(307, `/login?redirectUrl=${url.pathname}`)
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