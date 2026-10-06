<template>
  <div
    ref="recoveryTarget"
    :class="$style.component"
    role="group"
    aria-label="Telegram channels"
    tabindex="-1"
  >
    <QueryErrorState
      v-if="hasError"
      message="Could not load Telegram channels. Please try again."
      :is-retrying="isFetching"
      :is-blocking="!hasLoadedChannels"
      :restore-focus="restoreQueryFocus"
      @retry="refetch()"
    />

    <template v-if="isInitialLoading">
      Loading Telegram channels...
    </template>

    <template v-else-if="isEmpty">
      No verified Telegram channels found. <NuxtLink to="/account">Add some</NuxtLink>
    </template>

    <div
      v-for="channel in verifiedChannels"
      :key="channel.id"
      :class="$style.radioItem"
    >
      <input
        :class="$style.radioInput"
        type="radio"
        :id="`telegramChannel-${channel.id}`"
        name="telegramChannel"
        v-model="selectedChannel"
        :value="channel.id"
      />

      <label
        :for="`telegramChannel-${channel.id}`"
        :class="$style.radioLabel"
      >
        @{{ channel.chatId }}
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getTelegramChannels } from '~/composables/queries/telegram/channels'
  import { computed, useTemplateRef } from 'vue'
  import { useQuery } from '@tanstack/vue-query'
  import { useQueryFeedback } from '~/composables/use-query-feedback'
  import QueryErrorState from '~/components/QueryErrorState.vue'

  const selectedChannel = defineModel<number | null>({
    default: null
  })
  const recoveryTarget = useTemplateRef('recoveryTarget')

  const queryOptions = getTelegramChannels()
  const { data: channels, error, isPending, isFetching, refetch } = useQuery(queryOptions)
  const { hasError } = useQueryFeedback({ error, isFetching, queryKey: queryOptions.queryKey })
  const isInitialLoading = computed(() => isPending.value && !hasError.value)
  const hasLoadedChannels = computed(() => channels.value !== undefined)

  const verifiedChannels = computed(() => {
    const result = []

    const loadedChannels = channels.value ?? []

    for (const channel of loadedChannels) {
      if (channel.isVerified) {
        result.push(channel)
      }
    }

    return result
  })

  const isEmpty = computed(() => channels.value !== undefined && verifiedChannels.value.length === 0)

  function restoreQueryFocus() {
    recoveryTarget.value?.focus()
  }
</script>

<style module>
  .component {
    display: grid;
    gap: var(--spacing-8);
  }

  .radioItem {
    display: flex;
    align-items: center;
    column-gap: var(--spacing-8);
    cursor: pointer;
    padding: var(--spacing-8);
  }

  .radioInput {
    cursor: pointer;
  }

  .radioLabel {
    cursor: pointer;
  }
</style>
