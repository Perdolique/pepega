<template>
  <div :class="$style.component">
    <UiPageHeader
      title="Stream online"
      description="Choose the Telegram channel and message."
      :breadcrumb="breadcrumb"
    />

    <p
      v-if="isLoading"
      :class="$style.inlineState"
      role="status"
    >
      Loading notification settings…
    </p>

    <p
      v-else-if="queryError"
      :class="$style.error"
      role="alert"
    >
      Notification settings could not be loaded. Reload the page to try again.
    </p>

    <template v-else>
      <form
        :class="$style.form"
        @submit.prevent="saveSettings"
      >
        <div :class="$style.field">
          <label for="telegram-channel">
            Channel
          </label>
          <select
            id="telegram-channel"
            v-model="selectedChannelId"
            :disabled="hasVerifiedChannels === false || isSaving"
          >
            <option
              :value="null"
              disabled
            >
              Choose a verified channel
            </option>
            <option
              v-for="channel in verifiedChannels"
              :key="channel.id"
              :value="channel.id"
            >
              @{{ channel.chatId }}
            </option>
          </select>
        </div>

        <UiField
          label="Message"
          for-id="notification-message"
          helper="Sent when Twitch reports that your channel is live."
          :counter="messageCounter"
          :error="mutationError"
        >
          <UiTextarea
            id="notification-message"
            v-model="notificationMessage"
            :maxlength="limits.notificationMessageLength"
            :disabled="hasVerifiedChannels === false || isSaving"
          />
        </UiField>

        <div
          v-if="hasVerifiedChannels === false"
          :class="$style.missingChannel"
        >
          <span>A verified Telegram channel is required.</span>
          <NuxtLink to="/account">
            Open Account
          </NuxtLink>
        </div>

        <div :class="$style.saveRow">
          <UiButton
            type="submit"
            :disabled="isSaveDisabled"
          >
            {{ isSaving ? 'Saving…' : 'Save' }}
          </UiButton>
          <span
            v-if="savedFeedback"
            :class="$style.saved"
            role="status"
          >
            {{ savedFeedback }}
          </span>
        </div>
      </form>

      <section
        v-if="notification.data !== undefined"
        :class="$style.danger"
        aria-labelledby="danger-title"
      >
        <div>
          <h2 id="danger-title">
            Remove settings
          </h2>
          <p>Delete this notification and its Telegram destination.</p>
        </div>
        <UiButton
          variant="danger"
          :disabled="isDeletingNotification"
          @click="isDeleteOpen = true"
        >
          Delete settings
        </UiButton>
      </section>

      <UiConfirmDialog
        v-model="isDeleteOpen"
        title="Delete Stream online settings?"
        confirm-label="Delete settings"
        @confirm="deleteCurrentNotification"
      >
        This deletes the Stream online notification and its Telegram destination.
      </UiConfirmDialog>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { limits } from '~~/constants'
  import type { NotificationDestinationModel } from '~~/shared/models/notifications'
  import { useCreateTelegramNotification } from '~/composables/mutations/notification/destinations'
  import {
    useDeleteNotification,
    useInitNotifications
  } from '~/composables/mutations/notifications'
  import { getByNotificationId } from '~/composables/queries/notification/destinations'
  import { getNotificationByType } from '~/composables/queries/notifications'
  import { getTelegramChannels } from '~/composables/queries/telegram/channels'
  import UiButton from '~/components/ui/UiButton.vue'
  import UiConfirmDialog from '~/components/ui/UiConfirmDialog.vue'
  import UiField from '~/components/ui/UiField.vue'
  import UiPageHeader from '~/components/ui/UiPageHeader.vue'
  import UiTextarea from '~/components/ui/UiTextarea.vue'
  import { useQuery } from '@pinia/colada'
  import { FetchError } from 'ofetch'
  import { computed, ref, watch } from 'vue'
  import { useHead } from '#imports'

  const defaultMessage = 'ЗАЙДИТЕ НА СТРИМ ПОЖАЛУЙСТА Я ПОДРУБИЛСЯ!'
  const breadcrumb = { label: 'Notifications', to: '/notifications' }

  const selectedChannelId = ref<number | null>(null)
  const notificationMessage = ref(defaultMessage)
  const mutationError = ref('')
  const savedFeedback = ref('')
  const isDeleteOpen = ref(false)
  const hasHydratedForm = ref(false)

  const {
    state: notification,
    isPending: isNotificationPending
  } = useQuery(() => getNotificationByType('stream.online'))
  const {
    state: channels,
    isPending: isChannelsPending
  } = useQuery(getTelegramChannels)
  const {
    state: destinations,
    isPending: isDestinationsPending
  } = useQuery(() => getByNotificationId(notification.value.data?.id))
  const {
    initNotifications,
    isLoading: isInitializing
  } = useInitNotifications()
  const {
    createNotificationAsync,
    isLoading: isSavingDestination
  } = useCreateTelegramNotification()
  const {
    deleteNotification,
    isLoading: isDeletingNotification
  } = useDeleteNotification()

  const verifiedChannels = computed(
    () => channels.value.data?.filter(channel => channel.isVerified) ?? []
  )
  const hasVerifiedChannels = computed(() => verifiedChannels.value.length > 0)
  const telegramDestination = computed(
    () => destinations.value.data?.find(
      destination => destination.config.type === 'telegram'
    )
  )
  const isNotificationMissing = computed(
    () => notification.value.error instanceof FetchError
      && notification.value.error.statusCode === 404
  )
  const queryError = computed(
    () => (notification.value.error !== null && isNotificationMissing.value === false)
      || channels.value.error !== null
      || destinations.value.error !== null
  )
  const isLoading = computed(
    () => isNotificationPending.value
      || isChannelsPending.value
      || (notification.value.data !== undefined && isDestinationsPending.value)
  )
  const isSaving = computed(
    () => isInitializing.value || isSavingDestination.value
  )
  const messageCounter = computed(
    () => `${notificationMessage.value.length}/${limits.notificationMessageLength}`
  )
  const isSaveDisabled = computed(
    () => selectedChannelId.value === null
      || notificationMessage.value.length === 0
      || hasVerifiedChannels.value === false
      || isSaving.value
  )

  function hydrateForm(destination: NotificationDestinationModel | undefined) {
    if (destination === undefined || hasHydratedForm.value) {
      return
    }

    selectedChannelId.value = destination.telegramChannelId
    notificationMessage.value = destination.message
    hasHydratedForm.value = true
  }

  async function saveSettings() {
    if (selectedChannelId.value === null) {
      return
    }

    mutationError.value = ''
    savedFeedback.value = ''

    try {
      const existingNotification = notification.value.data
      const currentNotification = existingNotification
        ?? await initNotifications('stream.online')

      await createNotificationAsync({
        message: notificationMessage.value,
        notificationId: currentNotification.id,
        telegramChannelId: selectedChannelId.value
      })

      savedFeedback.value = 'Saved'
    } catch (error) {
      console.error('Failed to save notification destination', error)
      mutationError.value = 'Settings could not be saved. Try again.'
    }
  }

  async function deleteCurrentNotification() {
    mutationError.value = ''

    try {
      await deleteNotification('stream.online')
      selectedChannelId.value = null
      notificationMessage.value = defaultMessage
      hasHydratedForm.value = false
      savedFeedback.value = 'Settings deleted'
    } catch (error) {
      console.error('Failed to delete notification', error)
      mutationError.value = 'Settings could not be deleted. Try again.'
    }
  }

  watch(telegramDestination, hydrateForm, { immediate: true })
  useHead({ title: 'Stream online settings — Pepega' })
</script>

<style module>
  .component {
    display: grid;
    gap: var(--space-xl);
  }

  .inlineState,
  .error {
    padding-block: var(--space-md);
    color: var(--color-ink-secondary);
  }

  .error {
    color: var(--color-danger);
    font-weight: 700;
  }

  .form {
    max-inline-size: 42rem;
    display: grid;
    gap: var(--space-lg);
  }

  .field {
    display: grid;
    gap: var(--space-xs);
  }

  .field label {
    font-weight: 700;
  }

  .field select {
    min-block-size: var(--control-size);
    padding-inline: var(--space-md);
    border: 1px solid color-mix(in srgb, var(--color-ink) 48%, transparent);
    border-radius: var(--radius-control);
    background: var(--color-surface);
    color: var(--color-ink);
  }

  .missingChannel {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
    color: var(--color-ink-secondary);
  }

  .saveRow {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .saved {
    color: var(--color-ink-secondary);
    font-weight: 700;
  }

  .danger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    margin-block-start: var(--space-xl);
    padding-block-start: var(--space-xl);
    border-block-start: 1px solid color-mix(in srgb, var(--color-ink) 16%, transparent);
  }

  .danger h2 {
    font-size: 1.25rem;
  }

  .danger p {
    color: var(--color-ink-secondary);
  }

  @media (max-width: 32rem) {
    .danger {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
