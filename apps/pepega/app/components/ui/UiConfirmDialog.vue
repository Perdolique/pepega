<template><AlertDialogRoot v-model:open="open"><AlertDialogPortal><AlertDialogOverlay :class="$style.overlay" /><AlertDialogContent :class="$style.component"><AlertDialogTitle :class="$style.title">{{ title }}</AlertDialogTitle><AlertDialogDescription :class="$style.description"><slot /></AlertDialogDescription><div :class="$style.actions"><AlertDialogCancel as-child><UiButton variant="ghost">Cancel</UiButton></AlertDialogCancel><AlertDialogAction as-child><UiButton variant="danger" @click="$emit('confirm')">{{ confirmLabel }}</UiButton></AlertDialogAction></div></AlertDialogContent></AlertDialogPortal></AlertDialogRoot></template>
<script setup lang="ts">
  import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTitle } from 'reka-ui'
  import UiButton from './UiButton.vue'
  import { nextTick, watch } from 'vue'

  interface Props { confirmLabel?: string; title: string } const { confirmLabel = 'Delete', title } = defineProps<Props>(); defineEmits<{ confirm: [] }>(); const open = defineModel<boolean>({ required: true })
  let previousFocus: HTMLElement | null = null

  watch(open, async (isOpen) => {
    if (import.meta.server) {
      return
    }

    if (isOpen) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
      return
    }

    await nextTick()
    previousFocus?.focus()
    previousFocus = null
  })
</script>
<style module>
  .overlay { position: fixed; z-index: 60; inset: 0; background: rgb(38 32 26 / 70%); }
  .component { position: fixed; z-index: 61; inset: 50% auto auto 50%; translate: -50% -50%; inline-size: min(30rem, calc(100vw - 2rem)); display: grid; gap: var(--space-md); padding: var(--space-lg); border: var(--outline); border-radius: var(--radius-card); background: var(--color-surface); box-shadow: var(--shadow-feature); }
  .title { font: 800 1.375rem/1.15 var(--font-display); }
  .description { color: var(--color-ink-secondary); }
  .actions { display: flex; justify-content: flex-end; gap: var(--space-sm); flex-wrap: wrap; }
</style>
