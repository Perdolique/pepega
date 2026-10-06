// oxlint-disable import/no-default-export
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createAppQueryClient, watchQueryUser } from '~/utils/query-client'
import { useUserStore } from '~/stores/user'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'vue-query',
  dependsOn: ['pinia'],

  setup(nuxtApp) {
    const queryClient = createAppQueryClient(import.meta.server)

    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })

    if (import.meta.client) {
      const userStore = useUserStore()
      const stopWatching = watchQueryUser(queryClient, () => userStore.userId)

      nuxtApp.vueApp.onUnmount(stopWatching)
    }
  }
})
