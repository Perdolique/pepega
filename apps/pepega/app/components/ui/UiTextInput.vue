<template><input :id="id" v-model="model" :class="$style.component" /></template>
<script setup lang="ts">interface Props { id: string } defineProps<Props>(); const model = defineModel<string>({ required: true })</script>
<style module>.component { inline-size: 100%; min-block-size: var(--control-size); padding: 0 var(--space-md); border: var(--outline); border-radius: var(--radius-control); background: var(--color-surface); color: var(--color-ink); }</style>
