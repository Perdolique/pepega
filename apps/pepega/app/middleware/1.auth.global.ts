import { useUserStore } from '~/stores/user';
import { resolveAuthRedirect } from '~/utils/router';
import { defineNuxtRouteMiddleware, navigateTo } from '#imports';

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()
  const redirect = resolveAuthRedirect(to, userStore.isAuthenticated)

  if (redirect !== null) {
    return navigateTo(redirect, {
      replace: true
    })
  }
})
