<template><div :class="$style.component" :role="role"><Icon :name="icon" aria-hidden="true" /><div><h2 :class="$style.title">{{ title }}</h2><p :class="$style.description"><slot /></p></div><slot name="action" /></div></template>
<script setup lang="ts">interface Props { icon?: string; live?: boolean; title: string } const { icon = 'tabler:info-circle', live = false } = defineProps<Props>(); const role = live ? 'status' : undefined</script>
<style module>
  .component { display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-lg); border: var(--outline); border-radius: var(--radius-inner); background: var(--color-surface-muted); }
  .component > svg { flex: none; font-size: 1.5rem; }
  .title { font-size: 1.125rem; }
  .description { color: var(--color-ink-secondary); }
</style>
