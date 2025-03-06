<template>
  <div :class="$style.page">
    <h1>Admin</h1>

    <div>
      <SimpleButton
        :disabled="twitchSubscriptionsStore.isFetching"
        @click="twitchSubscriptionsStore.fetchSubscriptions"
      >
        {{ fetchButtonText }}
      </SimpleButton>
    </div>

    <SubscriptionCard
      v-for="[, subscription] in twitchSubscriptionsStore.subscriptions"
      :key="subscription.id"
      :subscription-id="subscription.id"
      :subscription-type="subscription.type"
      :broadcaster-id="subscription.broadcasterId"
      :streamer-name="subscription.streamerName"
      :streamer-login="subscription.streamerLogin"
    />
  </div>
</template>

<script lang="ts" setup>
  import SimpleButton from '~/components/SimpleButton.vue'
  import SubscriptionCard from '~/components/SubscriptionCard.vue'
  import { useTwitchSubscriptionsStore } from '~/stores/twitch-subscriptions'

  const twitchSubscriptionsStore = useTwitchSubscriptionsStore()

  const fetchButtonText = computed(() => {
    if (twitchSubscriptionsStore.isFetching) {
      return 'Fetching subscriptions...'
    }

    return 'Fetch subscriptions'
  })
</script>

<style module>
  .page {
    display: grid;
    row-gap: var(--spacing-16);
  }
</style>
