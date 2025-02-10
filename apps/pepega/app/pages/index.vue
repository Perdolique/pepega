<template>
  <div :class="$style.component">
    <img src="/pepega.webp" />
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    title: 'Pepega',
    skipAuth: true
  });
</script>

<style module>
  .component {
    display: grid;
    place-items: center;
    height: 100%;
  }
</style>
