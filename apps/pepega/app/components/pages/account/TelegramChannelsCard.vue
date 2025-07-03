<template>
  <BaseCard :class="$style.card">
    <h3>
      Telegram channels
    </h3>

    <div
      v-if="isPending"
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
        v-for="channel in channels.data"
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

  const isOpened = ref(false)
  const { state: channels, isPending } = useQuery(getTelegramChannels)
  const { mutate: addChannel, isLoading: isAddingChannel } = useAddTelegramChannel()
  const activeChannelId = ref<number | null>(null)

  const noChannels = computed(
    () => channels.value.data === undefined || channels.value.data?.length === 0
  )

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
