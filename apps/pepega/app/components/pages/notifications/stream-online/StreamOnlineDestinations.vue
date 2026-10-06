<template>
  <BaseCard :class="$style.component">
    <QueryErrorState
      v-if="hasError"
      message="Could not load notification destinations. Please try again."
      :is-retrying="isFetching"
      :is-blocking="!hasLoadedDestinations"
      :restore-focus="restoreQueryFocus"
      @retry="refetch()"
    />

    <FidgetSpinner v-if="isInitialLoading" />

    <template v-else-if="hasDestinations">
      <div
        ref="recoveryTarget"
        :class="$style.table"
        role="group"
        aria-label="Notification destinations"
        tabindex="-1"
      >
        <div :class="$style.tableRow">
          <div :class="$style.headerCell">Provider</div>
          <div :class="$style.headerCell">Active</div>
        </div>

        <div
          v-for="destination in destinations"
          :key="destination.id"
          :class="$style.tableRow"
        >
          <div>{{ destination.config.type }}</div>
          <div>{{ destination.isActive ? 'Yes' : 'No' }}</div>
        </div>
      </div>
    </template>

    <div
      v-else-if="hasLoadedDestinations"
      ref="recoveryTarget"
      tabindex="-1"
    >
      No stream online notifications created yet.
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
  import { getByNotificationId } from '~/composables/queries/notification/destinations'
  import BaseCard from '~/components/BaseCard.vue'
  import FidgetSpinner from '~/components/FidgetSpinner.vue'
  import { computed, useTemplateRef } from 'vue'
  import { useQuery } from '@tanstack/vue-query'
  import { useQueryFeedback } from '~/composables/use-query-feedback'
  import QueryErrorState from '~/components/QueryErrorState.vue'

  interface Props {
    notificationId: number;
  }

  const { notificationId } = defineProps<Props>()
  const recoveryTarget = useTemplateRef('recoveryTarget')

  const queryOptions = computed(() => getByNotificationId(notificationId))
  const queryKey = computed(() => queryOptions.value.queryKey)
  const { data: destinations, error, isPending, isFetching, refetch } = useQuery(queryOptions)
  const { hasError } = useQueryFeedback({ error, isFetching, queryKey })
  const isInitialLoading = computed(() => isPending.value && !hasError.value)
  const hasLoadedDestinations = computed(() => destinations.value !== undefined)

  const hasDestinations = computed(() => {
    return destinations.value && destinations.value.length > 0
  })

  function restoreQueryFocus() {
    recoveryTarget.value?.focus()
  }
</script>

<style module>
  .component {
    display: grid;
    gap: var(--spacing-8);
  }

  .table {
    display: grid;
    column-gap: var(--spacing-8);
  }

  .tableRow {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: var(--spacing-12);
  }

  .headerCell {
    font-weight: var(--font-weight-bold);
  }
</style>
