<template>
  <NuxtLink
    :class="$style.component"
    :to="to"
  >
    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
  import type { NuxtLinkProps } from '#app';
  import { NuxtLink } from '#components'

  defineProps<NuxtLinkProps>()
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
    transition: background-color var(--transition-fast);
    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: light-dark(oklch(80% 0 0), oklch(35% 0 0));
    }
  }
</style>
