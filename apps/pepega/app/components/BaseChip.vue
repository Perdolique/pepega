<template>
  <component
    :is="as"
    :class="$style.component"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
  import type { NuxtLink } from '#components'

  interface Props {
    as?: 'div' | 'a' | typeof NuxtLink;
  }

  const { as = 'div' } = defineProps<Props>()
</script>

<style module>
  .component {
    display: inline flex;
    align-items: center;
    height: var(--chip-height);
    font-size: var(--font-size-14);
    background-color: var(--chip-color-bg);
    border-radius: var(--chip-border-radius);
    padding: 0 var(--spacing-16);
  }
</style>
