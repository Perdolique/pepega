<template>
  <div
    v-if="streamerStore.isStreamer"
    :class="$style.component"
  >
    <h1>Notifications Settings</h1>

    <div :class="$style.cards">
      <StreamOnlineNotification />
    </div>
  </div>

  <NotStreamerPlaceholder v-else />
</template>

<script setup lang="ts">
  import { useStreamerStore } from '~/stores/streamer'
  import { useWebhooksStore } from '~/stores/webhooks';
  import NotStreamerPlaceholder from '~/components/NotStreamerPlaceholder.vue';
  import StreamOnlineNotification from '~/components/StreamOnlineNotification.vue'

  const streamerStore = useStreamerStore()
  const webhooksStore = useWebhooksStore()

  await useAsyncData(async () => {
    await Promise.allSettled([
      streamerStore.fetchStreamer(),
      webhooksStore.fetchWebhooks()
    ])

    return true
  })
</script>

<style module>
  .component {
    display: grid;
    row-gap: var(--spacing-24);
    container-type: inline-size;
  }

  .cards {
    display: grid;
    gap: var(--spacing-16);

    @container (width > 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
