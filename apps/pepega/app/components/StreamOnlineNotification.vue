<template>
  <BaseCard :class="$style.card">
    <div :class="$style.header">
      <div :class="$style.title">
        Stream online
      </div>

      <span :class="[$style.status, status]">
        {{ status }}
      </span>
    </div>

    <div :class="$style.description">
      Get notified when your stream goes live
    </div>

    <div :class="$style.buttons">
      <SimpleButton
        v-if="hasRemoveButton"
        :class="$style.button"
        :disabled="isRemoveDisabled"
        @click="onRemoveClick"
      >
        {{ removeButtonLabel }}
      </SimpleButton>

      <SimpleButton
        v-if="hasCreateButton"
        :class="$style.button"
        :disabled="isCreating"
        @click="onCreateClick"
      >
        {{ createButtonLabel }}
      </SimpleButton>

      <SimpleButton
        v-if="webhook"
        :class="$style.button"
        :disabled="isRegisterDisabled"
        @click="onRegisterClick"
      >
        Register
      </SimpleButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
  import { useTimeoutPoll } from '@vueuse/core'
  import type { WebhookStatus } from '~~/shared/models/webhooks'
  import { useWebhooksStore } from '~/stores/webhooks';
  import { useUserStore } from '~/stores/user';
  import SimpleButton from '~/components/SimpleButton.vue'
  import BaseCard from '~/components/BaseCard.vue'

  const statusPollingInterval = 5000
  const isCreating = ref(false)
  const isRemoving = ref(false)
  const isRegistering = ref(false)
  const webhooksStore = useWebhooksStore()
  const userStore = useUserStore()

  const webhook = computed(() => {
    for (const webhook of webhooksStore.webhooks.values()) {
      if (webhook.type === 'stream.online') {
        return webhook
      }
    }
  })

  const status = computed<WebhookStatus>(() => webhook.value?.status ?? 'not_active')
  const hasRemoveButton = computed(() => webhook.value !== undefined && userStore.isAdmin)
  const hasCreateButton = computed(() => webhook.value === undefined)

  const { pause: stopStatusPolling, resume: startStatusPolling } = useTimeoutPoll(async () => {
    if (webhook.value?.status === 'pending') {
      await webhooksStore.fetchWebhook(webhook.value.id)
    }
  }, statusPollingInterval, {
    immediate: false
  })

  const isRegisterDisabled = computed(() => {
    if (isRegistering.value || webhook.value === undefined) {
      return true
    }

    if (webhook.value.status === 'active' || webhook.value.status === 'pending') {
      return true
    }

    return false
  })

  const isRemoveDisabled = computed(() => isRemoving.value || isRegistering.value)

  const createButtonLabel = computed(() => {
    if (isCreating.value) {
      return 'Creating...'
    }

    return 'Create'
  })

  const removeButtonLabel = computed(() => {
    if (isRemoving.value) {
      return 'Removing...'
    }

    return 'Remove'
  })

  async function onCreateClick() {
    if (isCreating.value) {
      return
    }

    isCreating.value = true

    await webhooksStore.createWebhook('stream.online')

    isCreating.value = false
  }

  async function onRemoveClick() {
    if (isRemoving.value || webhook.value === undefined) {
      return
    }

    isRemoving.value = true

    // TODO: delete webhook from subscriptions store
    await webhooksStore.deleteWebhook(webhook.value.id)

    isRemoving.value = false
  }

  async function onRegisterClick() {
    if (isRegistering.value || webhook.value === undefined) {
      return
    }

    isRegistering.value = true

    await webhooksStore.registerWebhook(webhook.value)

    isRegistering.value = false
  }

  watch(status, (newStatus) => {
    // Do not start polling on the server
    if (import.meta.server) {
      return
    }

    if (newStatus === 'pending') {
      startStatusPolling()
    } else {
      stopStatusPolling()
    }
  }, {
    immediate: true
  })
</script>

<style module>
  .card {
    /* Status Colors */
    --status-active: light-dark(oklch(65% 0.2 142), oklch(70% 0.2 142));
    --status-pending: light-dark(oklch(65% 0.2 80), oklch(70% 0.2 80));
    --status-failed: light-dark(oklch(65% 0.2 30), oklch(70% 0.2 30));
    --status-revoked: light-dark(oklch(65% 0.1 0), oklch(70% 0.1 0));
    --status-not-active: light-dark(oklch(50% 0 0), oklch(70% 0 0));
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: start;
  }

  .title {
    font-size: var(--font-size-20);
    font-weight: var(--font-weight-medium);

    @container (width > 375px) {
      font-size: var(--font-size-24);
    }
  }

  .status {
    font-size: var(--font-size-12);
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-4) var(--spacing-8);
    border-radius: var(--border-radius-8);
    text-transform: uppercase;

    @container (width > 375px) {
      font-size: var(--font-size-14);
    }

    &:global(.active) {
      color: var(--status-active);
      background-color: color-mix(in oklch, var(--status-active), transparent 80%);
    }

    &:global(.pending) {
      color: var(--status-pending);
      background-color: color-mix(in oklch, var(--status-pending), transparent 80%);
    }

    &:global(.failed) {
      color: var(--status-failed);
      background-color: color-mix(in oklch, var(--status-failed), transparent 80%);
    }

    &:global(.revoked) {
      color: var(--status-revoked);
      background-color: color-mix(in oklch, var(--status-revoked), transparent 80%);
    }

    &:global(.not_active) {
      color: var(--status-not-active);
      background-color: color-mix(in oklch, var(--status-not-active), transparent 80%);
    }
  }

  .description {
    font-size: var(--font-size-14);
    color: var(--color-secondary);

    @container (width > 375px) {
      font-size: var(--font-size-16);
    }
  }

  .buttons {
    display: flex;
    column-gap: var(--spacing-8);
  }

  .button {
    justify-self: start;
  }
</style>
