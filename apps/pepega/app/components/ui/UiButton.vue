<template>
  <button :class="[$style.component, variant]" :type="type">
    <Icon v-if="icon" :name="icon" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
  import type { ButtonVariant } from '~/types/ui'

  interface Props {
    icon?: string;
    type?: 'button' | 'submit';
    variant?: ButtonVariant;
  }

  const { icon, type = 'button', variant = 'primary' } = defineProps<Props>()
</script>

<style module>
  .component {
    min-block-size: var(--control-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding-inline: var(--space-lg);
    border: 2px solid var(--color-ink);
    border-radius: var(--radius-full);
    background: var(--color-primary);
    color: var(--color-on-primary);
    font: 700 0.9375rem/1.2 var(--font-display);
    text-decoration: none;
    transition: background var(--motion-fast);
  }

  .component:hover:not(:disabled) {
    background: var(--color-primary-hover);
  }

  .component:global(.secondary) {
    background: var(--color-sun);
    color: var(--color-on-sun);
  }

  .component:global(.secondary):hover:not(:disabled) {
    background: var(--color-sun-hover);
  }

  .component:global(.danger) {
    background: var(--color-danger);
    color: var(--color-on-danger);
  }

  .component:global(.danger):hover:not(:disabled) {
    background: var(--color-danger-hover);
  }

  .component:global(.twitch) {
    background: var(--color-twitch);
    color: var(--color-on-twitch);
  }

  .component:global(.ghost) {
    border-color: transparent;
    background: transparent;
    color: var(--color-ink);
  }

  .component:global(.ghost):hover:not(:disabled) {
    background: var(--color-surface-muted);
  }
</style>
