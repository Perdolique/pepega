<template>
  <div :class="$style.component">
    <FidgetSpinner
      size="32"
    />

    <span :class="$style.text">
      <slot>Loading...</slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import FidgetSpinner from '~/components/FidgetSpinner.vue'
</script>

<style module>
  .component {
    height: 100%;
    width: 100%;
    display: grid;
    justify-content: center;
    align-content: center;
    row-gap: var(--spacing-16);
    justify-items: center;
  }

  .text {
    color: var(--color-secondary);
  }
</style>
