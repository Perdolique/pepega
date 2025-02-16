import type { UserModel } from "~~/shared/models/user"

export const useUserStore = defineStore('user', () => {
  const hasData = ref(false)
  const userId = ref<string | null>(null)
  const isAdmin = ref(false)
  const isAuthenticated = computed(() => userId.value !== null)

  function updateUser(user: UserModel) {
    userId.value = user.id
    isAdmin.value = user.isAdmin
  }

  async function fetchUser() {
    const { data } = await useFetch('/api/user')

    if (data.value?.id !== undefined) {
      updateUser(data.value)
    }

    hasData.value = true
  }

  async function logout() {
    await $fetch('/api/user/logout', {
      method: 'POST'
    })

    updateUser({
      id: null,
      isAdmin: false
    })
  }

  return {
    fetchUser,
    hasData,
    isAdmin,
    isAuthenticated,
    logout,
    updateUser,
    userId
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useUserStore, import.meta.hot)
  )
}
