<template>
  <div :class="$style.component">
    <UiPageHeader
      title="Notifications"
      description="Manage alerts from Twitch events."
    />

    <div
      v-if="userStore.isStreamer === false"
      :class="$style.inlineState"
    >
      <div>
        <strong>Streamer mode is off</strong>
        <p>Turn it on to use tools made for streamers.</p>
      </div>
      <UiButtonLink
        to="/account"
        variant="secondary"
      >
        Open account
      </UiButtonLink>
    </div>

    <template v-else>
      <div
        v-if="isInitialLoading"
        :class="$style.inlineState"
        role="status"
      >
        <span>Loading notification status…</span>
      </div>

      <template v-else>
        <div
          v-if="loadError"
          :class="$style.inlineState"
          role="alert"
        >
          <span>The last status may be out of date.</span>
          <UiButton
            variant="secondary"
            @click="loadWebhooks"
          >
            Retry
          </UiButton>
        </div>

        <StreamOnlineNotification />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import StreamOnlineNotification from '~/components/StreamOnlineNotification.vue'
  import UiButton from '~/components/ui/UiButton.vue'
  import UiButtonLink from '~/components/ui/UiButtonLink.vue'
  import UiPageHeader from '~/components/ui/UiPageHeader.vue'
  import { useUserStore } from '~/stores/user'
  import { useWebhooksStore } from '~/stores/webhooks'
  import { onMounted, ref, watch } from 'vue'
  import { useHead } from '#imports'

  const userStore = useUserStore()
  const webhooksStore = useWebhooksStore()
  const isInitialLoading = ref(false)
  const loadError = ref(false)

  async function loadWebhooks() {
    if (userStore.isStreamer === false) {
      return
    }

    isInitialLoading.value = webhooksStore.webhooks.size === 0
    loadError.value = (await webhooksStore.fetchWebhooks()) === false
    isInitialLoading.value = false
  }

  onMounted(loadWebhooks)
  watch(() => userStore.isStreamer, loadWebhooks)
  useHead({ title: 'Notifications — Pepega' })
</script>

<style module>
  .component {
    display: grid;
    gap: var(--space-xl);
  }

  .inlineState {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    padding-block: var(--space-md);
    border-block: 1px solid color-mix(in srgb, var(--color-ink) 16%, transparent);
  }

  .inlineState p,
  .inlineState span {
    color: var(--color-ink-secondary);
  }

  @media (max-width: 32rem) {
    .inlineState {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
