<template>
  <PageBase title="Stream Online notifications">
    <LoadingState v-if="isNotificationPending">
      Loading notifications...
    </LoadingState>

    <div
      v-else-if="notification.data"
      :class="$style.cards"
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

      <StreamOnlineDestinations :notification-id="notification.data.id" />

      <SimpleButton
        variant="secondary"
        :disabled="isDeletingNotification"
        @click="onDeleteNotificationClick"
      >
        Delete notification
      </SimpleButton>
    </div>

    <StreamOnlineEmptyState v-else />
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

  const defaultMessage = 'ЗАЙДИТЕ НА СТРИМ ПОЖАЛУЙСТА Я ПОДРУБИЛСЯ!'
  const { deleteNotification, isLoading: isDeletingNotification } = useDeleteNotification()
  const { createNotification, isLoading: isCreatingNotification } = useCreateTelegramNotification()
  const selectedChannel = ref<number | null>(null)
  const notificationMessage = ref('')
  const isMessageFieldDisabled = computed(() => selectedChannel.value === null)

  const isSubmitDisabled = computed(
    () =>
      isMessageFieldDisabled.value ||
      isCreatingNotification.value
  )

  const { state: notification, isPending: isNotificationPending } = useQuery(
    getNotificationByType,
    () => 'stream.online' as const
  )

  function onDeleteNotificationClick() {
    deleteNotification('stream.online')
  }

  function onCreateNotificationClick() {
    if (selectedChannel.value === null || notification.value.data === undefined) {
      console.warn('Cannot create notification: missing required fields')

      return
    }

    const message = notificationMessage.value || defaultMessage

    createNotification({
      message,
      notificationId: notification.value.data.id,
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
