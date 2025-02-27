<template>
  <div :class="$style.card">
    <slot />
  </div>
</template>

<style module>
  .card {
    display: grid;
    row-gap: var(--spacing-12);
    padding: var(--spacing-20);
    border-radius: var(--border-radius-16);
    background-color: color-mix(in oklch, var(--color-primary), transparent 50%);
    container-type: inline-size;

    @media (min-width: 768px) {
      padding: var(--spacing-24);
    }
  }
</style>
