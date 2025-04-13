<template>
  <BaseChip
    :as="NuxtLink"
    :class="$style.component"
    :to="to"
  >
    <slot />
  </BaseChip>
</template>

<script lang="ts" setup>
  import type { NuxtLinkProps } from '#app';
  import { NuxtLink } from '#components'
  import BaseChip from '~/components/BaseChip.vue'

  defineProps<NuxtLinkProps>()
</script>

<style module>
  .component {
    transition: background-color var(--transition-fast);
    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: light-dark(oklch(80% 0 0), oklch(35% 0 0));
    }
  }
</style>
