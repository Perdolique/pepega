<template><DialogRoot v-model:open="open"><DialogPortal><DialogOverlay :class="$style.overlay" /><DialogContent :class="$style.component"><header :class="$style.header"><div><DialogTitle :class="$style.title">{{ title }}</DialogTitle><DialogDescription v-if="description" :id="descriptionId" :class="$style.description">{{ description }}</DialogDescription><DialogDescription v-else :class="$style.visuallyHidden">Navigation and controls for {{ title }}.</DialogDescription></div><DialogClose as-child><UiIconButton icon="tabler:x" label="Close dialog" /></DialogClose></header><slot /></DialogContent></DialogPortal></DialogRoot></template>
<script setup lang="ts">
  import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
  import UiIconButton from './UiIconButton.vue'
  import { nextTick, useId, watch } from 'vue'

  interface Props { description?: string; title: string } defineProps<Props>(); const open = defineModel<boolean>({ required: true }); const descriptionId = useId()
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
  .overlay { position: fixed; z-index: 50; inset: 0; background: rgb(38 32 26 / 70%); animation: fade var(--motion-normal); }
  .component { position: fixed; z-index: 51; inset: 50% auto auto 50%; translate: -50% -50%; inline-size: min(34rem, calc(100vw - 2rem)); max-block-size: calc(100vh - 2rem); overflow: auto; display: grid; gap: var(--space-lg); padding: var(--space-lg); border: var(--outline); border-radius: var(--radius-card); background: var(--color-surface); color: var(--color-ink); box-shadow: var(--shadow-feature); animation: enter var(--motion-normal) var(--ease-product); }
  .header { display: flex; justify-content: space-between; gap: var(--space-md); }
  .title { font: 800 1.375rem/1.15 var(--font-display); }
  .description { margin-top: var(--space-xs); color: var(--color-ink-secondary); }
  .visuallyHidden { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes enter { from { opacity: 0; transform: scale(0.96); } }
</style>
