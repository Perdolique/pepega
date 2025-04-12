<template>
  <div :class="$style.card">
    <slot />
  </div>
</template>

<style module>
  .card {
    padding: var(--spacing-20);
    border-radius: var(--border-radius-16);
    background-color: color-mix(in oklch, var(--color-primary), transparent 50%);

    @media (min-width: 768px) {
      padding: var(--spacing-24);
    }
  }
</style>
