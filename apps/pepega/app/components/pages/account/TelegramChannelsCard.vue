<template>
  <section :class="$style.component">
    <header :class="$style.header">
      <div>
        <h2>Telegram channels</h2>
        <p>Verified channels are ready for Telegram integrations.</p>
      </div>
      <UiButton
        icon="tabler:plus"
        @click="isAddOpen = true"
      >
        Add channel
      </UiButton>
    </header>

    <p
      v-if="isPending"
      :class="$style.inlineState"
      role="status"
    >
      Loading channels…
    </p>
    <p
      v-else-if="channels.error"
      :class="$style.error"
      role="alert"
    >
      Channels could not be loaded. Reload the page to try again.
    </p>
    <p
      v-else-if="channelList.length === 0"
      :class="$style.inlineState"
    >
      No Telegram channels yet.
    </p>

    <ul
      v-else
      :class="$style.list"
    >
      <li
        v-for="channel in channelList"
        :key="channel.id"
      >
        <div :class="$style.channel">
          <strong>@{{ channel.chatId }}</strong>
          <span>{{ channel.isVerified ? 'Verified' : 'Verification required' }}</span>
        </div>

        <UiStatusBadge :tone="channel.isVerified ? 'success' : 'warning'">
          {{ channel.isVerified ? 'Ready' : 'Pending' }}
        </UiStatusBadge>

        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <UiIconButton
              icon="tabler:dots"
              :label="`Actions for @${channel.chatId}`"
            />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              :class="$style.menu"
              :side-offset="8"
              align="end"
            >
              <DropdownMenuItem
                v-if="channel.isVerified === false"
                :class="$style.menuItem"
                @select="openVerification(channel)"
              >
                <Icon
                  name="tabler:circle-check"
                  aria-hidden="true"
                />
                Verify channel
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[$style.menuItem, 'danger']"
                @select="openDelete(channel)"
              >
                <Icon
                  name="tabler:trash"
                  aria-hidden="true"
                />
                Delete channel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </li>
    </ul>

    <p
      v-if="deleteError"
      :class="$style.error"
      role="alert"
    >
      {{ deleteError }}
    </p>

    <UiDialog
      v-model="isAddOpen"
      title="Add Telegram channel"
      description="Enter the public channel name without @."
    >
      <form
        :class="$style.form"
        @submit.prevent="addChannel"
      >
        <UiField
          label="Channel name"
          for-id="telegram-chat-id"
          helper="Example: perdTV"
          :error="addError"
        >
          <UiTextInput
            id="telegram-chat-id"
            v-model="newChatId"
            minlength="5"
            maxlength="32"
            autocomplete="off"
          />
        </UiField>
        <UiButton
          type="submit"
          :disabled="isAddDisabled"
        >
          {{ isAddingChannel ? 'Adding…' : 'Add channel' }}
        </UiButton>
      </form>
    </UiDialog>

    <VerificationDialog
      v-if="verificationChannel"
      v-model="isVerifyOpen"
      :chat-id="verificationChannel.chatId"
      :channel-id="verificationChannel.id"
    />

    <UiConfirmDialog
      v-model="isDeleteOpen"
      :title="deleteTitle"
      confirm-label="Delete channel"
      @confirm="deleteChannel"
    >
      This removes the channel from Pepega and from destinations that use it.
    </UiConfirmDialog>
  </section>
</template>

<script setup lang="ts">
  import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
  import VerificationDialog from './telegram/VerificationDialog.vue'
  import { useAddTelegramChannel } from '~/composables/mutations/telegram/add-channel'
  import { useDeleteTelegramChannel } from '~/composables/mutations/telegram/delete-channel'
  import { getTelegramChannels } from '~/composables/queries/telegram/channels'
  import UiButton from '~/components/ui/UiButton.vue'
  import UiConfirmDialog from '~/components/ui/UiConfirmDialog.vue'
  import UiDialog from '~/components/ui/UiDialog.vue'
  import UiField from '~/components/ui/UiField.vue'
  import UiIconButton from '~/components/ui/UiIconButton.vue'
  import UiStatusBadge from '~/components/ui/UiStatusBadge.vue'
  import UiTextInput from '~/components/ui/UiTextInput.vue'
  import { useQuery } from '@pinia/colada'
  import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuTrigger
  } from 'reka-ui'
  import { computed, ref } from 'vue'

  const { state: channels, isPending } = useQuery(getTelegramChannels)
  const {
    mutateAsync: addChannelMutation,
    isLoading: isAddingChannel
  } = useAddTelegramChannel()
  const { mutateAsync: deleteChannelMutation } = useDeleteTelegramChannel()
  const isAddOpen = ref(false)
  const isVerifyOpen = ref(false)
  const isDeleteOpen = ref(false)
  const newChatId = ref('')
  const addError = ref('')
  const deleteError = ref('')
  const verificationChannel = ref<TelegramChannelModel | null>(null)
  const deletionChannel = ref<TelegramChannelModel | null>(null)
  const channelList = computed(() => channels.value.data ?? [])
  const isAddDisabled = computed(
    () => newChatId.value.length < 5 || isAddingChannel.value
  )
  const deleteTitle = computed(
    () => deletionChannel.value === null
      ? 'Delete channel?'
      : `Delete @${deletionChannel.value.chatId}?`
  )

  async function addChannel() {
    addError.value = ''

    try {
      await addChannelMutation(newChatId.value)
      newChatId.value = ''
      isAddOpen.value = false
    } catch (error) {
      console.error('Failed to add Telegram channel', error)
      addError.value = 'The channel could not be added. Check the name and try again.'
    }
  }

  function openVerification(channel: TelegramChannelModel) {
    verificationChannel.value = channel
    isVerifyOpen.value = true
  }

  function openDelete(channel: TelegramChannelModel) {
    deletionChannel.value = channel
    deleteError.value = ''
    isDeleteOpen.value = true
  }

  async function deleteChannel() {
    if (deletionChannel.value === null) {
      return
    }

    try {
      await deleteChannelMutation(deletionChannel.value.id)
      deletionChannel.value = null
    } catch (error) {
      console.error('Failed to delete Telegram channel', error)
      deleteError.value = 'The channel could not be deleted. Try again.'
    }
  }
</script>

<style module>
  .component {
    display: grid;
    gap: var(--space-lg);
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .header h2 {
    font-size: 1.25rem;
  }

  .header p,
  .inlineState {
    color: var(--color-ink-secondary);
  }

  .list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .list > li {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: var(--space-sm);
    padding-block: var(--space-sm);
    border-block-start: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent);
  }

  .list > li:last-child {
    border-block-end: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent);
  }

  .channel {
    min-inline-size: 0;
  }

  .channel strong,
  .channel span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .channel span {
    color: var(--color-ink-muted);
    font-size: var(--text-body-sm);
  }

  .menu {
    z-index: 70;
    min-inline-size: 12rem;
    padding: var(--space-xs);
    border: 1px solid color-mix(in srgb, var(--color-ink) 28%, transparent);
    border-radius: var(--radius-control);
    background: var(--color-surface);
  }

  .menuItem {
    min-block-size: 2.5rem;
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding-inline: var(--space-sm);
    border-radius: var(--radius-cell);
    outline: none;
  }

  .menuItem[data-highlighted] {
    background: var(--color-surface-muted);
  }

  .menuItem:global(.danger) {
    color: var(--color-danger);
  }

  .error {
    color: var(--color-danger);
    font-weight: 700;
  }

  .form {
    display: grid;
    gap: var(--space-lg);
  }

  .form > button {
    justify-self: end;
  }

  @media (max-width: 30rem) {
    .list > li {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .list > li > span {
      grid-row: 2;
      justify-self: start;
    }
  }
</style>
