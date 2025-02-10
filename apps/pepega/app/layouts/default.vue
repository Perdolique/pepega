<template>
  <div :class="$style.component">
    <NavBar />

    <div :class="$style.content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import NavBar from '~/components/NavBar.vue';
</script>

<style module>
  .component {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100vh;
  }

  .content {
    padding: var(--spacing-24);
    overflow: auto;
  }
</style>
