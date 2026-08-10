<template>
  <div :class="$style.component">
    <PublicHeader />

    <main :class="$style.content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import PublicHeader from '~/components/PublicHeader.vue'
</script>

<style module>
  .component {
    inline-size: min(100% - 2rem, 73.75rem);
    min-block-size: 100vh;
    margin-inline: auto;
  }

  .content {
    min-block-size: calc(100vh - 4rem);
    display: grid;
    align-items: start;
    padding-block: var(--space-xxl) 5rem;
  }

  @media (min-width: 48rem) {
    .component {
      inline-size: min(100% - 3rem, 73.75rem);
    }
  }
</style>
