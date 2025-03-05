<template>
  <BaseCard :class="$style.component">
    <h3 :class="$style.type">
      {{ subscriptionType }}
    </h3>

    <SimpleButton
      @click="onDeleteClick"
      :disabled="isDeleting"
    >
      {{ deleteButtonLabel }}
    </SimpleButton>
  </BaseCard>
</template>

<script lang="ts" setup>
  import { useTwitchSubscriptionsStore } from '~/stores/twitch-subscriptions'
  import BaseCard from '~/components/BaseCard.vue'
  import SimpleButton from '~/components/SimpleButton.vue'

  interface Props {
    subscriptionId: string;
    subscriptionType: string;
    broadcasterId: string;
    streamerName: string | null;
    streamerLogin: string | null;
  }

  const { subscriptionId, subscriptionType, streamerName, streamerLogin } = defineProps<Props>()
  const twitchSubscriptionsStore = useTwitchSubscriptionsStore()
  const isDeleting = ref(false)
  const deleteButtonLabel = computed(() => isDeleting.value ? 'Deleting...' : 'Delete')

  async function onDeleteClick() {
    if (isDeleting.value) {
      return
    }

    isDeleting.value = true

    await twitchSubscriptionsStore.deleteSubscription(subscriptionId)

    isDeleting.value = false
  }
</script>

<style module>
  .component {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: var(--spacing-12);
  }

  .type {
    font-size: var(--font-size-20);
    font-weight: var(--font-weight-medium);

    @container (width > 375px) {
      font-size: var(--font-size-24);
    }
  }
</style>
