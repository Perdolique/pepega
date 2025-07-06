<template>
  <div :class="$style.page">
    <h1>{{ title }}</h1>

    <slot />
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string;
  }

  const { title } = defineProps<Props>()

  useHead({
    title
  })
</script>

<style module>
  .page {
    height: 100%;
    display: grid;
    row-gap: var(--spacing-24);
    grid-template-rows: auto 1fr;
    align-items: start;
  }
</style>
