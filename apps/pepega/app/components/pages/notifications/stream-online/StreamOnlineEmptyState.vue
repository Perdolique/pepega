<template>
  <EmptyState
    title="No notifications created"
    description="You haven't created any notifications for stream online events yet. Once you do, they will appear here."
    buttonText="Create notification"
    :disabled="isInitializing"
    @action="onAction"
  />
</template>

<script lang="ts" setup>
  import { useInitNotifications } from '~/composables/mutations/notifications'
  import EmptyState from '~/components/pages/EmptyState.vue'

  const { initNotifications, isLoading: isInitializing } = useInitNotifications()

  function onAction() {
    initNotifications('stream.online')
  }
</script>
