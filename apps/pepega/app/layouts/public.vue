<template><div :class="$style.component"><PublicHeader /><main :class="$style.content"><slot /></main></div></template>
<script setup lang="ts">import PublicHeader from '~/components/PublicHeader.vue'</script>
<style module>
  .component { inline-size: min(100% - 2rem, 73.75rem); min-block-size: 100vh; margin-inline: auto; }
  .content { padding-block: clamp(var(--space-xl), 7vw, var(--space-section)) 5rem; }
</style>
