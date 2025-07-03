import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub'

interface SubscriptionModel {
  id: string;
  type: EventSubscriptionType;
  broadcasterId: string;
  streamerName: string | null;
  streamerLogin: string | null;
}

export const useTwitchSubscriptionsStore = defineStore('twitch-subscriptions', () => {
  const subscriptions = ref(new Map<string, SubscriptionModel>())
  const isFetching = ref(false)

  async function fetchSubscriptions() {
    try {
      isFetching.value = true

      const response = await $fetch('/api/twitch/subscriptions')

      for (const subscription of response) {
        subscriptions.value.set(subscription.id, subscription)
      }
    } catch (error) {
      logger.error('Error fetching subscriptions:', error);
    } finally {
      isFetching.value = false
    }
  }

  async function deleteSubscription(subscriptionId: string) {
    try {
      await $fetch(`/api/twitch/subscriptions/${subscriptionId}`, {
        method: 'DELETE'
      })

      subscriptions.value.delete(subscriptionId)
    } catch (error) {
      logger.error('Error deleting subscription:', error);
    }
  }

  return {
    deleteSubscription,
    fetchSubscriptions,
    isFetching,
    subscriptions
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useTwitchSubscriptionsStore, import.meta.hot)
  )
}
