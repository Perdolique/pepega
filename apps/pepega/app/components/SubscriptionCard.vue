<template>
  <BaseCard :class="$style.component">
    <div :class="$style.info">
      <h3 :class="$style.type">
        {{ subscriptionType }}
      </h3>

      <div
        v-if="displayStreamerName"
        :class="$style.streamer"
      >
        <ChipLink
          :class="$style.streamerLink"
          to="#"
        >
          <Icon name="tabler:user" />

          {{ displayStreamerName }}
        </ChipLink>

        <a
          v-if="twitchUrl"
          target="_blank"
          rel="noopener noreferrer"
          :href="twitchUrl"
          :class="$style.twitchLink"
        >
          <Icon name="tabler:brand-twitch" />
        </a>
      </div>
    </div>

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
  import ChipLink from '~/components/ChipLink.vue'

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

  const twitchUrl = computed(() => {
    if (streamerLogin === null) {
      return null
    }

    return `https://twitch.tv/${streamerLogin}`
  })

  const displayStreamerName = computed(() => {
    if (streamerName === null) {
      return streamerLogin
    }

    return streamerName
  })

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

  .info {
    display: grid;
    row-gap: var(--spacing-16);
  }

  .type {
    font-size: var(--font-size-20);
    font-weight: var(--font-weight-medium);

    @container (width > 375px) {
      font-size: var(--font-size-24);
    }
  }

  .streamer {
    display: flex;
    align-items: center;
    column-gap: var(--spacing-4);
  }

  .streamerLink {
    column-gap: var(--spacing-4);
  }

  .twitchLink {
    height: var(--chip-height);
    aspect-ratio: 1;
    display: inline flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: var(--font-size-20);
    user-select: none;
    color: white;
    background-color: var(--color-twitch-purple);
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--color-twitch-purple-hover);
    }
  }
</style>
