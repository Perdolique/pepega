export const useUserStore = defineStore('user', () =>{
  const hasData = ref(false)
  const userId = ref<string | null>(null)
  const isAuthenticated = computed(() => userId.value !== null)

  async function fetchUser() {
    const { data } = await useFetch('/api/user')

    if (data.value?.userId !== undefined) {
      userId.value = data.value.userId
    }

    hasData.value = true
  }

  async function logout() {
    await $fetch('/api/user/logout', {
      method: 'POST'
    })

    userId.value = null
  }

  return {
    fetchUser,
    hasData,
    isAuthenticated,
    logout,
    userId
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useUserStore, import.meta.hot)
  )
}
