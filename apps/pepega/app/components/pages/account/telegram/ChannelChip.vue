<template>
  <div
    ref="rootRef"
    :class="$style.component"
  >
    <button
      :class="[$style.chip, { active: isTooltipVisible }]"
      @click="toggleTooltip"
    >
      {{ channel.chatId }}
    </button>

    <AnimatePresence>
      <motion.div
        v-if="isTooltipVisible"
        :key="channel.chatId"
        :class="[$style.tooltipWrapper, { rightAligned }]"
        :initial="{ visibility: 'hidden', opacity: 0.5, height: 0 }"
        :animate="{ visibility: 'visible', opacity: 1, height: 'auto' }"
        :exit="{ opacity: 0.5, height: 0, visibility: 'hidden' }"
        :transition="{ duration: 0.15 }"
      >
        <div
          :class="$style.menu"
          ref="menuRef"
        >
          <button
            :class="[$style.menuItem, 'alert']"
            @click="showConfirmDialog"
            :disabled="telegramChannelsStore.isDeletingChannel"
          >
            <Icon
              name="tabler:trash-x"
              size="1.25em"
            />

            <span :class="$style.menuItemText">
              {{ telegramChannelsStore.isDeletingChannel ? 'Deleting...' : 'Delete channel' }}
            </span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>

    <ConfirmationDialog
      v-model="isConfirmationDialogVisible"
      headerText="Delete Telegram Channel"
      confirmButtonText="Delete"
      @confirm="onDeleteChannel"
    >
      Are you sure you want to delete the channel "{{ channel.chatId }}"? This action cannot be undone.
    </ConfirmationDialog>
  </div>
</template>

<script lang="ts" setup>
  import { motion, AnimatePresence } from 'motion-v'
  import { useIntersectionObserver } from '@vueuse/core'
  import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
  import { useClickOutside } from '~/composables/use-click-outside'
  import { useTelegramChannelsStore } from '~/stores/telegram-channels'
  import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue'

  type Emits = (event: 'toggle', channelId: number | null) => void

  interface Props {
    channel: TelegramChannelModel;
    activeChannelId: number | null;
  }

  const { channel, activeChannelId } = defineProps<Props>()
  const emit = defineEmits<Emits>()
  const rootRef = useTemplateRef('rootRef')
  const menuRef = useTemplateRef('menuRef')
  const isTooltipVisible = computed(() => activeChannelId === channel.id)
  const rightAligned = ref(false)
  const telegramChannelsStore = useTelegramChannelsStore()
  const isConfirmationDialogVisible = ref(false)

  const { pause, resume } = useIntersectionObserver(menuRef, ([entry]) => {
    if (entry === undefined) {
      return
    }

    if (entry.boundingClientRect.right > entry.intersectionRect.right) {
      rightAligned.value = true
    } else {
      rightAligned.value = false
    }

    pause()
  }, {
    threshold: 1,
    immediate: false
  })

  function showTooltip() {
    emit('toggle', channel.id)
  }

  function hideTooltip() {
    emit('toggle', null)
  }

  function toggleTooltip() {
    if (isTooltipVisible.value) {
      hideTooltip()
    } else {
      showTooltip()
    }
  }

  function showConfirmDialog() {
    isConfirmationDialogVisible.value = true

    hideTooltip()
  }

  function onDeleteChannel() {
    telegramChannelsStore.deleteChannel(channel.id)
  }

  useClickOutside(isTooltipVisible, hideTooltip, {
    ignore: [rootRef]
  })

  watch(isTooltipVisible, (visible) => {
    if (visible) {
      resume()
    } else {
      rightAligned.value = false
    }
  })
</script>

<style module>
  .component {
    --chip-outline-size: 2px;

    position: relative;
  }

  .chip {
    outline: none;
    height: var(--chip-height);
    border: 2px solid transparent;
    border-radius: var(--chip-border-radius);
    transition-duration: var(--transition-fast);
    transition-property: box-shadow, background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    background-color: var(--chip-color-bg);

    &:global(.active),
    &:focus,
    &:active {
      background-color: var(--chip-color-bg-active);
      box-shadow:
        0 0 0 calc(var(--chip-outline-size) / 2) var(--chip-color-bg-active),
        0 0 0 var(--chip-outline-size) var(--chip-color-border);
    }
  }

  .tooltipWrapper {
    position: absolute;
    top: calc(100% + var(--chip-outline-size) + 2px);
    left: 0;
    z-index: 1;
    overflow: hidden;

    &:global(.rightAligned) {
      left: auto;
      right: 0;
    }
  }

  .menu {
    --menu-item-height: 40px;

    border-radius: var(--border-radius-8);
    overflow: hidden;
    max-width: 200px;
    border: 1px solid var(--chip-color-border);
  }

  .menuItem {
    width: 100%;
    padding: var(--spacing-4) var(--spacing-16);
    display: flex;
    align-items: center;
    column-gap: var(--spacing-8);
    height: var(--menu-item-height);
    white-space: nowrap;
    background-color: var(--chip-color-bg);
    outline: none;
    transition-duration: var(--transition-fast);
    transition-property: background-color;
    transition-timing-function: ease-out;

    &:focus-visible,
    &:hover {
      background-color: var(--chip-color-bg-active);
    }

    &:global(.alert) {
      color: var(--color-alert);
    }
  }

  .menuItemText {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
</style>
