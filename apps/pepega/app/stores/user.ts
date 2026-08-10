import type { UserModel } from '~~/shared/models/user'
import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { $fetch } from 'ofetch'
import { useFetch } from '#imports'
import { createLogger } from '@pepega/utils/logger'

const logger = createLogger('PEPEGA')

export const useUserStore = defineStore('user', () => {
  const hasData = ref(false)
  const userId = ref<string | null>(null)
  const isAdmin = ref(false)
  const isStreamer = ref(false)
  const displayName = ref<string | null>(null)
  const login = ref<string | null>(null)
  const isAuthenticated = computed(() => userId.value !== null)

  function updateUser(user: UserModel) {
    userId.value = user.id
    isAdmin.value = user.isAdmin
    isStreamer.value = user.isStreamer
    displayName.value = user.displayName
    login.value = user.login
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
      isAdmin: false,
      isStreamer: false,
      displayName: null,
      login: null
    })
  }

  async function setStreamer(newValue: boolean) {
    try {
      const response = await $fetch<UserModel>(`/api/user/${userId.value}/streamer`, {
        method: 'PATCH',

        body: {
          isStreamer: newValue
        }
      })

      updateUser(response)
      return true
    } catch (error) {
      logger.error('Failed to update streamer mode', error)
      return false
    }
  }

  return {
    fetchUser,
    displayName,
    hasData,
    isAdmin,
    isAuthenticated,
    isStreamer,
    logout,
    login,
    setStreamer,
    updateUser,
    userId
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useUserStore, import.meta.hot)
  )
}
