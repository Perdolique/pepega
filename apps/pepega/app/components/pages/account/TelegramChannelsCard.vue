<template>
  <BaseCard :class="$style.card">
    <h3>
      Telegram channels
    </h3>

    <div
      v-if="telegramChannelsStore.isGettingChannels"
      :class="$style.loading"
    >
      Loading...
    </div>

    <div
      v-else
      :class="$style.channels"
    >
      <ChannelChip
        v-for="channel in telegramChannelsStore.channels.data"
        :key="channel.id"
        :channel="channel"
        :active-channel-id="activeChannelId"
        @toggle="onChipToggle"
      />
    </div>

    <SimpleButton
      @click="showModal"
      :disabled="telegramChannelsStore.isAddingChannel"
    >
      <template v-if="telegramChannelsStore.isAddingChannel">
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
      initial-value="woof"
      :minlength="5"
      :maxlength="32"
      v-model="isOpened"
      @submit="telegramChannelsStore.addChannel"
    />
  </BaseCard>
</template>

<script lang="ts" setup>
  import BaseCard from '~/components/BaseCard.vue'
  import SimpleButton from '~/components/SimpleButton.vue'
  import InputDialog from '~/components/dialogs/InputDialog.vue'
  import { useTelegramChannelsStore } from '~/stores/telegram-channels'
  import ChannelChip from './telegram/ChannelChip.vue'

  const isOpened = ref(false)
  const telegramChannelsStore = useTelegramChannelsStore()
  const activeChannelId = ref<number | null>(null)

  function showModal() {
    isOpened.value = true
  }

  function onChipToggle(channelId: number | null) {
    activeChannelId.value = channelId
  }
</script>

<style module>
  .card {
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
