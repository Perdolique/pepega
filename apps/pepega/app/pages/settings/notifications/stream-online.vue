<template>
  <PageBase title="Stream Online notifications">
    <QueryErrorState
      v-if="hasError"
      message="Could not load notifications. Please try again."
      :is-retrying="isFetching"
      :is-blocking="!hasLoadedNotification"
      :restore-focus="restoreQueryFocus"
      @retry="refetch()"
    />

    <LoadingState v-if="isInitialLoading">
      Loading notifications...
    </LoadingState>

    <div
      v-else-if="notification"
      ref="recoveryTarget"
      :class="$style.cards"
      role="group"
      aria-label="Stream online notification settings"
      tabindex="-1"
    >
      <BaseCard :class="$style.card">
        <section :class="$style.formSection">
          <fieldset :class="$style.fieldset">
            <legend>Telegram channels</legend>

            <TelegramChannels v-model="selectedChannel" />
          </fieldset>

          <fieldset :class="$style.fieldset">
            <legend>Notification message</legend>

            <textarea
              :class="$style.message"
              v-model="notificationMessage"
              :placeholder="defaultMessage"
              :disabled="isMessageFieldDisabled"
              :maxlength="limits.notificationMessageLength"
            ></textarea>

            <SimpleButton
              :disabled="isSubmitDisabled"
              @click="onCreateNotificationClick"
            >
              Create notification
            </SimpleButton>
          </fieldset>
        </section>
      </BaseCard>

      <StreamOnlineDestinations :notification-id="notification.id" />

      <SimpleButton
        variant="secondary"
        :disabled="isDeletingNotification"
        @click="onDeleteNotificationClick"
      >
        Delete notification
      </SimpleButton>
    </div>

    <div v-else-if="hasNoNotification" ref="recoveryTarget" tabindex="-1">
      <StreamOnlineEmptyState />
    </div>
  </PageBase>
</template>

<script setup lang="ts">
  import { limits } from '~~/constants'
  import { getNotificationByType } from '~/composables/queries/notifications'
  import { useDeleteNotification } from '~/composables/mutations/notifications'
  import { useCreateTelegramNotification } from '~/composables/mutations/notification/destinations'
  import PageBase from '~/components/PageBase.vue'
  import LoadingState from '~/components/pages/notifications/stream-online/LoadingState.vue'
  import SimpleButton from '~/components/SimpleButton.vue'
  import StreamOnlineDestinations from '~/components/pages/notifications/stream-online/StreamOnlineDestinations.vue'
  import TelegramChannels from '~/components/pages/notifications/stream-online/TelegramChannels.vue'
  import BaseCard from '~/components/BaseCard.vue'
  import StreamOnlineEmptyState from '~/components/pages/notifications/stream-online/StreamOnlineEmptyState.vue'
  import { computed, ref, useTemplateRef } from 'vue'
  import { useQuery } from '@tanstack/vue-query'
  import { useQueryFeedback } from '~/composables/use-query-feedback'
  import QueryErrorState from '~/components/QueryErrorState.vue'

  const defaultMessage = 'ЗАЙДИТЕ НА СТРИМ ПОЖАЛУЙСТА Я ПОДРУБИЛСЯ!'
  const { deleteNotification, isPending: isDeletingNotification } = useDeleteNotification()
  const { createNotification, isPending: isCreatingNotification } = useCreateTelegramNotification()
  const selectedChannel = ref<number | null>(null)
  const notificationMessage = ref('')
  const recoveryTarget = useTemplateRef('recoveryTarget')
  const isMessageFieldDisabled = computed(() => selectedChannel.value === null)

  const isSubmitDisabled = computed(
    () =>
      isMessageFieldDisabled.value ||
      isCreatingNotification.value
  )

  const queryOptions = getNotificationByType('stream.online')
  const { data: notification, error, isPending, isFetching, refetch } = useQuery(queryOptions)
  const { hasError } = useQueryFeedback({ error, isFetching, queryKey: queryOptions.queryKey })
  const isInitialLoading = computed(() => isPending.value && !hasError.value)
  const hasLoadedNotification = computed(() => notification.value !== undefined)
  const hasNoNotification = computed(() => notification.value === null)

  function restoreQueryFocus() {
    recoveryTarget.value?.focus()
  }

  function onDeleteNotificationClick() {
    deleteNotification('stream.online')
  }

  function onCreateNotificationClick() {
    const currentNotification = notification.value

    if (selectedChannel.value === null || currentNotification === undefined || currentNotification === null) {
      console.warn('Cannot create notification: missing required fields')

      return
    }

    const message = notificationMessage.value || defaultMessage

    createNotification({
      message,
      notificationId: currentNotification.id,
      telegramChannelId: selectedChannel.value
    })
  }
</script>

<style module>
  .cards {
    display: grid;
    gap: var(--spacing-16);
    align-items: start;

    @container (width > 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .card {
    display: grid;
    row-gap: var(--spacing-20);
  }

  .formSection {
    display: grid;
    gap: var(--spacing-16);
  }

  .fieldset {
    border-radius: var(--border-radius-16);
    padding: var(--spacing-16);
  }

  .message {
    width: 100%;
    height: 100px;
    resize: none;
    padding: var(--spacing-8);
    border-radius: var(--border-radius-12);
  }
</style>
