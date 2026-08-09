<template><NuxtLink :class="[$style.component, variant]" :to="to"><Icon v-if="icon" :name="icon" aria-hidden="true" /><slot /></NuxtLink></template>
<script setup lang="ts">
  import type { ButtonVariant } from '~/types/ui'
  import type { RouteLocationRaw } from 'vue-router'

  interface Props { icon?: string; to: RouteLocationRaw; variant?: ButtonVariant }
  const { icon, to, variant = 'primary' } = defineProps<Props>()
</script>
<style module>
  .component { min-height: var(--control-size); padding: 0 var(--space-lg); display: inline-flex; align-items: center; justify-content: center; gap: var(--space-xs); border: var(--outline); border-radius: var(--radius-full); background: var(--color-primary); color: var(--color-on-primary); box-shadow: var(--shadow-control); font: 700 0.9375rem/1.2 var(--font-display); text-decoration: none; transition: transform var(--motion-fast), box-shadow var(--motion-fast), background var(--motion-fast); &:hover { background: var(--color-primary-hover); transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--color-shadow); } &:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--color-shadow); } &:global(.secondary) { background: var(--color-sun); color: var(--color-on-sun); } &:global(.danger) { background: var(--color-danger); color: var(--color-on-danger); } &:global(.twitch) { background: var(--color-twitch); color: var(--color-on-twitch); } &:global(.ghost) { background: transparent; color: var(--color-ink); box-shadow: none; } }
</style>
