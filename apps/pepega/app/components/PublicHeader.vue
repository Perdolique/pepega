<template>
  <header :class="$style.component">
    <AppBrand />
  </header>
</template>

<script setup lang="ts">
  import AppBrand from './AppBrand.vue'
</script>

<style module>
  .component {
    min-block-size: 4rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 16%, transparent);
  }
</style>
