<template><textarea :id="id" v-model="model" :class="$style.component" /></template>
<script setup lang="ts">interface Props { id: string } defineProps<Props>(); const model = defineModel<string>({ required: true })</script>
<style module>.component { inline-size: 100%; min-block-size: 8rem; padding: var(--space-sm) var(--space-md); resize: vertical; border: var(--outline); border-radius: var(--radius-control); background: var(--color-surface); color: var(--color-ink); }</style>
