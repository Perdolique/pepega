<template>
  <section :class="$style.component">
    <div :class="$style.copy">
      <strong>Stream online</strong>
      <span>
        {{ statusLabel }}<template v-if="isStale"> · Status may be out of date</template>
      </span>
      <p
        v-if="actionError"
        :class="$style.error"
        role="alert"
      >
        {{ actionError }}
      </p>
    </div>

    <div :class="$style.actions">
      <UiButton
        v-if="showEnableAction"
        :disabled="isWorking"
        @click="enableWebhook"
      >
        {{ isWorking ? 'Connecting…' : primaryActionLabel }}
      </UiButton>

      <UiButtonLink
        v-else-if="status === 'active'"
        to="/settings/notifications/stream-online"
        variant="secondary"
      >
        Settings
      </UiButtonLink>

      <span
        v-else
        :class="$style.connecting"
        role="status"
      >
        Connecting
      </span>

      <DropdownMenuRoot v-if="canRemove">
        <DropdownMenuTrigger as-child>
          <UiIconButton
            icon="tabler:dots"
            label="Stream online actions"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            :class="$style.menu"
            :side-offset="8"
            align="end"
          >
            <DropdownMenuItem
              :class="$style.dangerItem"
              @select="isConfirmOpen = true"
            >
              <Icon
                name="tabler:trash"
                aria-hidden="true"
              />
              Remove webhook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </div>

    <UiConfirmDialog
      v-model="isConfirmOpen"
      title="Remove stream webhook?"
      confirm-label="Remove webhook"
      @confirm="removeWebhook"
    >
      This removes the Twitch subscription used for live alerts. Notification
      settings remain saved.
    </UiConfirmDialog>
  </section>
</template>

<script setup lang="ts">
  import type { WebhookModel, WebhookStatus } from '~~/shared/models/webhooks'
  import UiButton from './ui/UiButton.vue'
  import UiButtonLink from './ui/UiButtonLink.vue'
  import UiConfirmDialog from './ui/UiConfirmDialog.vue'
  import UiIconButton from './ui/UiIconButton.vue'
  import { useUserStore } from '~/stores/user'
  import { useWebhooksStore } from '~/stores/webhooks'
  import { useTimeoutPoll } from '@vueuse/core'
  import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuTrigger
  } from 'reka-ui'
  import { computed, ref, watch } from 'vue'

  const statusLabels: Record<WebhookStatus, string> = {
    active: 'Enabled',
    failed: 'Needs attention',
    not_active: 'Disabled',
    pending: 'Connecting',
    revoked: 'Needs attention'
  }

  const webhooksStore = useWebhooksStore()
  const userStore = useUserStore()
  const isWorking = ref(false)
  const isConfirmOpen = ref(false)
  const isStale = ref(false)
  const actionError = ref('')
  const webhook = computed(
    () => [...webhooksStore.webhooks.values()].find(
      item => item.type === 'stream.online'
    )
  )
  const status = computed<WebhookStatus>(
    () => webhook.value?.status ?? 'not_active'
  )
  const statusLabel = computed(() => statusLabels[status.value])
  const showEnableAction = computed(() => status.value !== 'active' && status.value !== 'pending')
  const primaryActionLabel = computed(
    () => status.value === 'failed' || status.value === 'revoked' || isStale.value
      ? 'Retry'
      : 'Enable'
  )
  const canRemove = computed(
    () => webhook.value !== undefined && userStore.isAdmin
  )

  const { pause, resume } = useTimeoutPoll(async () => {
    const currentWebhook = webhook.value

    if (currentWebhook?.status !== 'pending') {
      return
    }

    const refreshedWebhook = await webhooksStore.fetchWebhook(currentWebhook.id)
    isStale.value = refreshedWebhook === undefined
  }, 5000, { immediate: false })

  async function registerWebhook(currentWebhook: WebhookModel) {
    const success = await webhooksStore.registerWebhook(currentWebhook)

    if (success === false) {
      actionError.value = 'Twitch could not enable this notification. Try again.'
    }
  }

  async function enableWebhook() {
    isWorking.value = true
    isStale.value = false
    actionError.value = ''

    const existingWebhook = webhook.value
    const creationResult = existingWebhook
      ?? await webhooksStore.createWebhook('stream.online')

    if ('error' in creationResult) {
      actionError.value = 'The notification could not be enabled. Try again.'
      isWorking.value = false
      return
    }

    await registerWebhook(creationResult)
    isWorking.value = false
  }

  async function removeWebhook() {
    const currentWebhook = webhook.value

    if (currentWebhook === undefined) {
      return
    }

    actionError.value = ''

    const success = await webhooksStore.deleteWebhook(currentWebhook.id)

    if (success === false) {
      actionError.value = 'The webhook could not be removed. Try again.'
    }

  }

  watch(status, (value) => {
    if (import.meta.server) {
      return
    }

    if (value === 'pending') {
      resume()
    } else {
      pause()
    }
  }, { immediate: true })
</script>

<style module>
  .component {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    padding-block: var(--space-md);
    border-block: 1px solid color-mix(in srgb, var(--color-ink) 16%, transparent);
  }

  .copy strong,
  .copy span {
    display: block;
  }

  .copy strong {
    font-family: var(--font-display);
    font-size: 1.125rem;
  }

  .copy span,
  .connecting {
    color: var(--color-ink-secondary);
  }

  .error {
    margin-block-start: var(--space-xs);
    color: var(--color-danger);
    font-size: var(--text-body-sm);
    font-weight: 700;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .menu {
    z-index: 70;
    min-inline-size: 12rem;
    padding: var(--space-xs);
    border: 1px solid color-mix(in srgb, var(--color-ink) 28%, transparent);
    border-radius: var(--radius-control);
    background: var(--color-surface);
  }

  .dangerItem {
    min-block-size: 2.5rem;
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding-inline: var(--space-sm);
    border-radius: var(--radius-cell);
    color: var(--color-danger);
    outline: none;
  }

  .dangerItem[data-highlighted] {
    background: var(--color-surface-muted);
  }

  @media (max-width: 32rem) {
    .component {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
