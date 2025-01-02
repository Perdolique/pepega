import { redirect } from '@sveltejs/kit'
import { getTwitchAuthUrl } from '$lib/server/oauth/twitch'
import { redirectUrlParam } from '$lib/constants'

export function load({ url, locals }) {
  if (locals.userId !== undefined) {
    const redirectUrl = url.searchParams.get(redirectUrlParam) ?? '/dashboard'

    redirect(307, redirectUrl)
  }
}

export const actions = {
  login: async (event) => {
    const twitchAuthUrl = getTwitchAuthUrl(event)

    redirect(307, twitchAuthUrl)
  }
}
