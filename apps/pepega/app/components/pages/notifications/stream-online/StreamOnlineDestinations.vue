<template>
  <BaseCard :class="$style.card">
    <FidgetSpinner v-if="isPending" />

    <template v-else-if="hasDestinations">
      <div :class="$style.table">
        <div :class="$style.tableRow">
          <div :class="$style.headerCell">Provider</div>
          <div :class="$style.headerCell">Active</div>
        </div>

        <div
          v-for="destination in destinations.data"
          :key="destination.id"
          :class="$style.tableRow"
        >
          <div :class="$style.cell">{{ destination.config.type }}</div>
          <div :class="$style.cell">{{ destination.isActive ? 'Yes' : 'No' }}</div>
        </div>
      </div>
    </template>

    <template v-else>
      No stream online notifications created yet.
    </template>
  </BaseCard>
</template>

<script lang="ts" setup>
  import { getByNotificationId } from '~/composables/queries/notification/destinations'
  import BaseCard from '~/components/BaseCard.vue'
  import FidgetSpinner from '~/components/FidgetSpinner.vue'

  interface Props {
    notificationId: number;
  }

  const { notificationId } = defineProps<Props>()

  const { state: destinations, isPending } = useQuery(
    getByNotificationId,
    () => notificationId
  )

  const hasDestinations = computed(() => {
    return destinations.value.data && destinations.value.data.length > 0
  })
</script>

<style module>
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
