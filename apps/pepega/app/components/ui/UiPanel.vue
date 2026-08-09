<template><section :class="[$style.component, variant]"><slot /></section></template>
<script setup lang="ts">import type { PanelVariant } from '~/types/ui';

 interface Props { variant?: PanelVariant } const { variant = 'standard' } = defineProps<Props>()</script>
<style module>
  .component { padding: var(--space-lg); border-radius: var(--radius-card); background: var(--color-surface); color: var(--color-ink); &:global(.quiet) { padding: var(--space-md); border: var(--outline); border-radius: var(--radius-inner); background: var(--color-surface-muted); } &:global(.standard) { border: var(--outline); box-shadow: var(--shadow-card); } &:global(.featured) { border: var(--outline); border-radius: var(--radius-feature); background: var(--color-surface-featured); box-shadow: var(--shadow-feature); } }
</style>
