<template>
  <div :class="$style.component">
    <ProductHeader />

    <main :class="$style.content">
      <div :class="$style.canvas">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import ProductHeader from '~/components/ProductHeader.vue'
</script>

<style module>
  .component {
    min-block-size: 100vh;
  }

  .content {
    padding: var(--space-xl) var(--space-md) 5rem;
  }

  .canvas {
    inline-size: min(100%, 90rem);
    margin-inline: auto;
  }

  @media (min-width: 48rem) {
    .content {
      padding-inline: var(--space-lg);
    }
  }
</style>
