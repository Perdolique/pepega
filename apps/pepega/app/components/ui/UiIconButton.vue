<template><button :class="$style.component" type="button"><Icon :name="icon" aria-hidden="true" /><span :class="$style.label">{{ label }}</span></button></template>
<script setup lang="ts">interface Props { icon: string; label: string } defineProps<Props>()</script>
<style module>
  .component { inline-size: var(--control-size); block-size: var(--control-size); display: inline-grid; place-items: center; border: var(--outline); border-radius: var(--radius-full); background: var(--color-surface); box-shadow: var(--shadow-control); }
  .label { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
