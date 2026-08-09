<template><UiPanel :class="$style.component"><header :class="$style.header"><div><p :class="$style.kicker">TWITCH EVENT</p><h2>Stream online</h2></div><UiStatusBadge :tone="statusTone">{{ statusLabel }}</UiStatusBadge></header><p :class="$style.description">Send a Telegram notification when your Twitch channel goes live.</p><p v-if="actionError" :class="$style.error" role="alert">{{ actionError }}</p><div :class="$style.actions"><UiButton v-if="webhook === undefined" :disabled="isCreating" @click="createWebhook">{{ isCreating ? 'Creating…' : 'Create webhook' }}</UiButton><UiButton v-else-if="canRegister" :disabled="isRegistering" @click="registerWebhook">{{ isRegistering ? 'Registering…' : 'Register' }}</UiButton><UiButtonLink to="/settings/notifications/stream-online" :variant="webhook === undefined ? 'ghost' : 'secondary'" icon="tabler:settings">Settings</UiButtonLink><UiButton v-if="canRemove" variant="danger" :disabled="isRemoving" @click="isConfirmOpen = true">Remove</UiButton></div><UiConfirmDialog v-model="isConfirmOpen" title="Remove stream webhook?" confirm-label="Remove webhook" @confirm="removeWebhook">This removes the Twitch subscription used for live alerts. Notification settings will remain until you delete them separately.</UiConfirmDialog></UiPanel></template>
<script setup lang="ts">
  import { useTimeoutPoll } from '@vueuse/core'; import type { StatusTone } from '~/types/ui'; import type { WebhookStatus } from '~~/shared/models/webhooks'; import { useWebhooksStore } from '~/stores/webhooks'; import { useUserStore } from '~/stores/user'
  import UiButton from './ui/UiButton.vue'; import UiButtonLink from './ui/UiButtonLink.vue'; import UiConfirmDialog from './ui/UiConfirmDialog.vue'; import UiPanel from './ui/UiPanel.vue'; import UiStatusBadge from './ui/UiStatusBadge.vue'; import { computed, ref, watch } from 'vue'

  const webhooksStore = useWebhooksStore(); const userStore = useUserStore(); const isCreating = ref(false); const isRegistering = ref(false); const isRemoving = ref(false); const isConfirmOpen = ref(false); const actionError = ref('')
  const webhook = computed(() => [...webhooksStore.webhooks.values()].find(item => item.type === 'stream.online')); const status = computed<WebhookStatus>(() => webhook.value?.status ?? 'not_active'); const canRegister = computed(() => webhook.value !== undefined && !['active', 'pending'].includes(webhook.value.status)); const canRemove = computed(() => webhook.value !== undefined && userStore.isAdmin)
  const statusLabels: Record<WebhookStatus, string> = { active: 'Active', failed: 'Failed', not_active: 'Not active', pending: 'Pending', revoked: 'Revoked' }; const statusLabel = computed(() => statusLabels[status.value]); const statusTone = computed<StatusTone>(() => {
    switch (status.value) {
      case 'active': { return 'success' }
      case 'pending': { return 'warning' }
      case 'not_active': { return 'neutral' }
      default: { return 'danger' }
    }
  })
  const { pause, resume } = useTimeoutPoll(async () => { if (webhook.value?.status === 'pending') {await webhooksStore.fetchWebhook(webhook.value.id)} }, 5000, { immediate: false })
  async function createWebhook() { isCreating.value = true; actionError.value = ''; const success = await webhooksStore.createWebhook('stream.online'); if (success === false) {actionError.value = 'The webhook could not be created. Try again.';} isCreating.value = false }
  async function registerWebhook() { if (webhook.value === undefined) {return;} isRegistering.value = true; actionError.value = ''; const success = await webhooksStore.registerWebhook(webhook.value); if (success === false) {actionError.value = 'Twitch registration failed. Try again.';} isRegistering.value = false }
  async function removeWebhook() { if (webhook.value === undefined) {return;} isRemoving.value = true; actionError.value = ''; const success = await webhooksStore.deleteWebhook(webhook.value.id); if (success === false) {actionError.value = 'The webhook could not be removed. Try again.';} isRemoving.value = false }
  watch(status, value => { if (import.meta.server) {return;} if (value === 'pending') {resume();} else {pause()} }, { immediate: true })
</script>
<style module>
  .component { display: grid; gap: var(--space-md); }
  .header { display: flex; justify-content: space-between; align-items: start; gap: var(--space-md); & h2 { font-size: 1.75rem; } }
  .kicker { color: var(--color-ink-muted); font: 700 0.6875rem/1.4 var(--font-metadata); letter-spacing: 0.08em; }
  .description { color: var(--color-ink-secondary); }
  .error { color: var(--color-danger); font-weight: 700; }
  .actions { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
</style>
