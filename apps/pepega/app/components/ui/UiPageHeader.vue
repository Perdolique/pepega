<template><header :class="$style.component"><div :class="$style.copy"><nav v-if="breadcrumb" :class="$style.breadcrumb" aria-label="Breadcrumb"><NuxtLink :to="breadcrumb.to">{{ breadcrumb.label }}</NuxtLink><span aria-hidden="true">/</span><span>{{ title }}</span></nav><h1 :class="$style.title">{{ title }}</h1><p v-if="description" :class="$style.description">{{ description }}</p></div><div v-if="$slots.action" :class="$style.action"><slot name="action" /></div></header></template>
<script setup lang="ts">interface Breadcrumb { label: string; to: string } interface Props { breadcrumb?: Breadcrumb; description?: string; title: string } defineProps<Props>()</script>
<style module>
  .component { display: flex; align-items: end; justify-content: space-between; gap: var(--space-lg); flex-wrap: wrap; }
  .copy { display: grid; gap: var(--space-xs); max-inline-size: 52rem; }
  .title { font-size: clamp(2rem, 6vw, 2.5rem); line-height: 1.05; font-weight: 800; letter-spacing: -0.02em; }
  .description { color: var(--color-ink-secondary); font-size: var(--text-body-lg); }
  .breadcrumb { display: flex; gap: var(--space-xs); color: var(--color-ink-muted); font: 500 var(--text-metadata)/1.4 var(--font-metadata); }
  .action { flex: none; }
</style>
