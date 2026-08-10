<template>
  <span :class="[$style.component, tone]">
    <slot />
  </span>
</template>

<script setup lang="ts">
  import type { StatusTone } from '~/types/ui'

  interface Props {
    tone?: StatusTone;
  }

  const { tone = 'neutral' } = defineProps<Props>()
</script>

<style module>
  .component {
    min-block-size: 1.75rem;
    display: inline-flex;
    align-items: center;
    padding-inline: var(--space-sm);
    border-radius: var(--radius-full);
    background: var(--color-surface-muted);
    color: var(--color-ink-secondary);
    font-size: var(--text-label-sm);
    font-weight: 700;
  }

  .component:global(.success) {
    background: var(--color-mint);
    color: var(--color-on-mint);
  }

  .component:global(.warning) {
    background: var(--color-sun);
    color: var(--color-on-sun);
  }

  .component:global(.danger) {
    background: var(--color-danger);
    color: var(--color-on-danger);
  }

  .component:global(.info) {
    background: var(--color-sky);
    color: var(--color-on-sky);
  }
</style>
