<template>
  <PageBase title="Notifications">
    <div>
      <div
        v-if="userStore.isStreamer"
        :class="$style.cards"
      >
        <StreamOnlineNotification />
      </div>

      <NotStreamerPlaceholder v-else />
    </div>
  </PageBase>
</template>

<script setup lang="ts">
  import { useWebhooksStore } from '~/stores/webhooks'
  import { useUserStore } from '~/stores/user'
  import NotStreamerPlaceholder from '~/components/NotStreamerPlaceholder.vue'
  import StreamOnlineNotification from '~/components/StreamOnlineNotification.vue'
  import PageBase from '~/components/PageBase.vue'

  const webhooksStore = useWebhooksStore()
  const userStore = useUserStore()

  await useAsyncData(async () => {
    if (userStore.isStreamer) {
      await webhooksStore.fetchInitialWebhooks()
    }

    return webhooksStore.webhooks
  })

  watch(() => userStore.isStreamer, (isStreamer) => {
    if (isStreamer) {
      webhooksStore.fetchWebhooks()
    }
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
