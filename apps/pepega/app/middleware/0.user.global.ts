import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    const userStore = useUserStore()

    if (userStore.hasData === false) {
      await userStore.fetchUser()
    }
  }
})
