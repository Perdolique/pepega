import type { SubscriptionModel } from '#shared/models/twitch'
import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { $fetch } from 'ofetch'
import { createLogger } from '@pepega/utils/logger'

const logger = createLogger('PEPEGA')

export const useTwitchSubscriptionsStore = defineStore('twitch-subscriptions', () => {
  const subscriptions = ref(new Map<string, SubscriptionModel>())
  const isFetching = ref(false)
  const hasFetched = ref(false)
  const fetchError = ref(false)

  async function fetchSubscriptions() {
    try {
      isFetching.value = true
      fetchError.value = false

      const response = await $fetch<SubscriptionModel[]>('/api/twitch/subscriptions')

      for (const subscription of response) {
        subscriptions.value.set(subscription.id, subscription)
      }
      return true
    } catch (error) {
      logger.error('Error fetching subscriptions:', error);
      fetchError.value = true
      return false
    } finally {
      isFetching.value = false
      hasFetched.value = true
    }
  }

  async function deleteSubscription(subscriptionId: string) {
    try {
      await $fetch(`/api/twitch/subscriptions/${subscriptionId}`, {
        method: 'DELETE'
      })

      subscriptions.value.delete(subscriptionId)
      return true
    } catch (error) {
      logger.error('Error deleting subscription:', error);
      return false
    }
  }

  return {
    deleteSubscription,
    fetchSubscriptions,
    fetchError,
    hasFetched,
    isFetching,
    subscriptions
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useTwitchSubscriptionsStore, import.meta.hot)
  )
}
