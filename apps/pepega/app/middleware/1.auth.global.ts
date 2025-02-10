import { useUserStore } from '~/stores/user';
import { shouldSkipAuth } from '~/utils/router';

export default defineNuxtRouteMiddleware(async (to) => {
  if (shouldSkipAuth(to)) {
    return
  }

  const userStore = useUserStore()

  if (userStore.isAuthenticated && to.path === '/login') {
    const redirectTo = to.query.redirectTo?.toString() || '/dashboard'

    return navigateTo({
      path: redirectTo,
      replace: true
    })
  }

  if (userStore.isAuthenticated === false && to.path !== '/login') {
    return navigateTo({
      path: '/login',
      replace: true,

      query: {
        redirectTo: to.fullPath
      }
    })
  }
})
