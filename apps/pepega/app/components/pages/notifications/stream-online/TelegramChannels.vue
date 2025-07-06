<template>
  <div>
    <template v-if="isChannelsPending">
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

  const selectedChannel = defineModel<number | null>({
    default: null
  })

  const { state: channels, isPending: isChannelsPending } = useQuery(getTelegramChannels)

  const verifiedChannels = computed(() => {
    const result = []

    for (const channel of channels.value.data || []) {
      if (channel.isVerified) {
        result.push(channel)
      }
    }

    return result
  })

  const isEmpty = computed(() => verifiedChannels.value.length === 0)
</script>

<style module>
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
