import { fail, redirect } from '@sveltejs/kit'
import { createSession } from '$lib/session'

export function load({ url, locals }) {
  if (locals.userId !== undefined) {
    const redirectUrl = url.searchParams.get('redirectUrl') ?? '/dashboard'

    return redirect(307, redirectUrl)
  }
}

export const actions = {
  login: async (event) => {
    const sessionData = await createSession(event, {
      userId: 'USER_ID'
    })

    if (sessionData === null) {
      return fail(401, {
        error: 'Не получилось залогиниться, братишка 😢'
      })
    }

    const redirectUrl = event.url.searchParams.get('redirectUrl') ?? '/dashboard'

    return redirect(307, redirectUrl)
  }
}
