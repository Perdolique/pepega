<template><span :class="[$style.component, tone]"><slot /></span></template>
<script setup lang="ts">import type { StatusTone } from '~/types/ui';

 interface Props { tone?: StatusTone } const { tone = 'neutral' } = defineProps<Props>()</script>
<style module>
  .component { display: inline-flex; align-items: center; min-height: 1.75rem; padding: 0 var(--space-sm); border: 1px solid currentColor; border-radius: var(--radius-full); background: var(--color-surface-muted); color: var(--color-ink-secondary); font-size: var(--text-label-sm); font-weight: 700; &:global(.success) { background: var(--color-mint); color: var(--color-on-mint); } &:global(.warning) { background: var(--color-sun); color: var(--color-on-sun); } &:global(.danger) { background: var(--color-danger); color: var(--color-on-danger); } &:global(.info) { background: var(--color-sky); color: var(--color-on-sky); } }
</style>
