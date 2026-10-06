<template>
  <BaseCard :class="$style.component">
    <h3 ref="recoveryTarget" tabindex="-1">
      Telegram channels
    </h3>

    <QueryErrorState
      v-if="hasError"
      message="Could not load Telegram channels. Please try again."
      :is-retrying="isFetching"
      :is-blocking="!hasLoadedChannels"
      :restore-focus="restoreQueryFocus"
      @retry="refetch()"
    />

    <div
      v-if="isInitialLoading"
      :class="$style.loading"
    >
      Loading...
    </div>

    <div v-else-if="noChannels">
      No channels added yet.
    </div>

    <div
      v-else
      :class="$style.channels"
    >
      <ChannelChip
        v-for="channel in channels"
        :key="channel.id"
        :channel="channel"
        :active-channel-id="activeChannelId"
        @toggle="onChipToggle"
      />
    </div>

    <SimpleButton
      @click="showModal"
      :disabled="isAddingChannel"
    >
      <template v-if="isAddingChannel">
        Adding channel...
      </template>

      <template v-else>
        Add new channel
      </template>
    </SimpleButton>

    <InputDialog
      header-text="Add Telegram channel"
      placeholder="perdTV"
      add-button-text="Add channel"
      :minlength="5"
      :maxlength="32"
      v-model="isOpened"
      @submit="addChannel"
    />
  </BaseCard>
</template>

<script lang="ts" setup>
  import { getTelegramChannels } from '~/composables/queries/telegram/channels'
  import { useAddTelegramChannel } from '~/composables/mutations/telegram/add-channel'
  import BaseCard from '~/components/BaseCard.vue'
  import SimpleButton from '~/components/SimpleButton.vue'
  import InputDialog from '~/components/dialogs/InputDialog.vue'
  import ChannelChip from './telegram/ChannelChip.vue'
  import { computed, ref, useTemplateRef } from 'vue'
  import { useQuery } from '@tanstack/vue-query'
  import { useQueryFeedback } from '~/composables/use-query-feedback'
  import QueryErrorState from '~/components/QueryErrorState.vue'

  const isOpened = ref(false)
  const recoveryTarget = useTemplateRef('recoveryTarget')
  const queryOptions = getTelegramChannels()
  const { data: channels, error, isPending, isFetching, refetch } = useQuery(queryOptions)
  const { hasError } = useQueryFeedback({ error, isFetching, queryKey: queryOptions.queryKey })
  const isInitialLoading = computed(() => isPending.value && !hasError.value)
  const hasLoadedChannels = computed(() => channels.value !== undefined)
  const { mutate: addChannel, isPending: isAddingChannel } = useAddTelegramChannel()
  const activeChannelId = ref<number | null>(null)

  const noChannels = computed(
    () => channels.value?.length === 0
  )

  function showModal() {
    isOpened.value = true
  }

  function restoreQueryFocus() {
    recoveryTarget.value?.focus()
  }

  function onChipToggle(channelId: number | null) {
    activeChannelId.value = channelId
  }
</script>

<style module>
  .component {
    display: grid;
    row-gap: var(--spacing-16);
    justify-content: start;
  }

  .channels {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-8);
  }

  .loading {
    opacity: 0.6;
  }
</style>
