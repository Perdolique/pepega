import { ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { $fetch } from 'ofetch';
import { createLogger } from '@pepega/utils/logger';
import type { SubscriptionModel } from '#shared/models/twitch';

const logger = createLogger('PEPEGA');

export const useTwitchSubscriptionsStore = defineStore('twitch-subscriptions', () => {
  const subscriptions = ref(new Map<string, SubscriptionModel>());
  const isFetching = ref(false);

  async function fetchSubscriptions() {
    try {
      isFetching.value = true;

      const response = await $fetch<SubscriptionModel[]>('/api/twitch/subscriptions');

      for (const subscription of response) {
        subscriptions.value.set(subscription.id, subscription);
      }
    } catch (error) {
      logger.error('Error fetching subscriptions:', error);
    } finally {
      isFetching.value = false;
    }
  }

  async function deleteSubscription(subscriptionId: string) {
    try {
      await $fetch(`/api/twitch/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });

      subscriptions.value.delete(subscriptionId);
    } catch (error) {
      logger.error('Error deleting subscription:', error);
    }
  }

  return {
    deleteSubscription,
    fetchSubscriptions,
    isFetching,
    subscriptions,
  };
});

const subscriptionsHot = import.meta.hot;

if (subscriptionsHot) {
  subscriptionsHot.accept(acceptHMRUpdate(useTwitchSubscriptionsStore, subscriptionsHot));
}
