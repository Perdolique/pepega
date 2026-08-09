<template><ToastProvider><ToastRoot v-for="toast in toasts" :key="toast.id" :class="[$style.toast, toast.tone ?? 'info']" :duration="toast.duration ?? defaultDuration" @update:open="onOpenChange($event, toast.id)"><div><ToastTitle v-if="toast.title" :class="$style.title">{{ toast.title }}</ToastTitle><ToastDescription :class="$style.description">{{ toast.message }}</ToastDescription></div><ToastClose as-child><UiIconButton icon="tabler:x" label="Dismiss notification" /></ToastClose></ToastRoot><ToastViewport :class="$style.component" /></ToastProvider></template>
<script setup lang="ts">
  import useToaster from '~/composables/use-toaster'
  import UiIconButton from './UiIconButton.vue'
  import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'

  const defaultDuration = 5000
  const { removeToast, toasts } = useToaster()
  function onOpenChange(open: boolean, id: string) { if (open === false) {removeToast(id)} }
</script>
<style module>
  .component { position: fixed; z-index: 100; inset: var(--space-md) var(--space-md) auto auto; inline-size: min(24rem, calc(100vw - 2rem)); display: grid; gap: var(--space-sm); margin: 0; padding: 0; list-style: none; outline: none; }
  .toast { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-sm); padding: var(--space-md); border: var(--outline); border-radius: var(--radius-inner); background: var(--color-sky); color: var(--color-on-sky); box-shadow: var(--shadow-card); &[data-state="open"] { animation: enter var(--motion-normal); } &:global(.success) { background: var(--color-mint); color: var(--color-on-mint); } &:global(.error) { background: var(--color-danger); color: var(--color-on-danger); } }
  .title { font-family: var(--font-display); font-weight: 800; }
  .description { font-size: var(--text-body-sm); }
  @keyframes enter { from { opacity: 0; transform: translateX(1rem); } }
</style>
