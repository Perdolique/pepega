<template><label :class="$style.component"><span><strong :class="$style.label">{{ label }}</strong><span v-if="description" :class="$style.description">{{ description }}</span></span><SwitchRoot v-model="model" :class="$style.root"><SwitchThumb :class="$style.thumb" /></SwitchRoot></label></template>
<script setup lang="ts">import { SwitchRoot, SwitchThumb } from 'reka-ui';

 interface Props { description?: string; label: string } defineProps<Props>(); const model = defineModel<boolean>({ required: true })</script>
<style module>
  .component { display: flex; align-items: center; justify-content: space-between; gap: var(--space-lg); }
  .label, .description { display: block; }
  .label { font-family: var(--font-display); }
  .description { color: var(--color-ink-secondary); font-size: var(--text-body-sm); }
  .root { flex: none; inline-size: 3.25rem; block-size: 1.875rem; padding: 0.1875rem; border: var(--outline); border-radius: var(--radius-full); background: var(--color-surface-muted); &[data-state="checked"] { background: var(--color-mint); } }
  .thumb { display: block; inline-size: 1.25rem; block-size: 1.25rem; border-radius: 50%; background: var(--color-ink); transition: transform var(--motion-fast); will-change: transform; &[data-state="checked"] { transform: translateX(1.375rem); } }
</style>
