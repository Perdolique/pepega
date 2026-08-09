<template><div :class="$style.component"><UiPageHeader title="Notifications" description="Choose what Pepega sends when your Twitch channel changes state." /><UiPanel v-if="userStore.isStreamer === false" :class="$style.gate" variant="featured"><Icon name="tabler:lock" aria-hidden="true" /><div><h2>Streamer mode is off</h2><p>Turn it on in Account to create Twitch live notifications. Saved settings stay safe when the mode is off.</p></div><UiButtonLink to="/account">Open account</UiButtonLink></UiPanel><UiStatePanel v-else-if="isInitialLoading" title="Loading notifications" icon="tabler:loader-2" live>Checking your Twitch webhook…</UiStatePanel><template v-else><UiStatePanel v-if="loadError" title="Could not refresh status" icon="tabler:alert-triangle">The last known state is shown below and may be stale.<template #action><UiButton variant="secondary" @click="loadWebhooks">Retry</UiButton></template></UiStatePanel><StreamOnlineNotification /></template></div></template>
<script setup lang="ts">
  import StreamOnlineNotification from '~/components/StreamOnlineNotification.vue'; import UiButton from '~/components/ui/UiButton.vue'; import UiButtonLink from '~/components/ui/UiButtonLink.vue'; import UiPageHeader from '~/components/ui/UiPageHeader.vue'; import UiPanel from '~/components/ui/UiPanel.vue'; import UiStatePanel from '~/components/ui/UiStatePanel.vue'; import { useUserStore } from '~/stores/user'; import { useWebhooksStore } from '~/stores/webhooks'
  import { onMounted, ref, watch } from 'vue'; import { useHead } from '#imports'

  const userStore = useUserStore(); const webhooksStore = useWebhooksStore(); const isInitialLoading = ref(false); const loadError = ref(false)
  async function loadWebhooks() { if (userStore.isStreamer === false) {return;} isInitialLoading.value = webhooksStore.webhooks.size === 0; loadError.value = (await webhooksStore.fetchWebhooks()) === false; isInitialLoading.value = false }
  onMounted(loadWebhooks); watch(() => userStore.isStreamer, loadWebhooks); useHead({ title: 'Notifications — Pepega' })
</script>
<style module>
  .component { display: grid; gap: var(--space-xl); }
  .gate { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: var(--space-lg); & > svg { font-size: 3rem; } & p { color: var(--color-ink-secondary); } & > a { grid-column: 1 / -1; justify-self: start; } }
</style>
