<template><div :class="$style.component"><aside :class="$style.sidebar"><ProductNav /></aside><header :class="$style.mobileHeader"><AppBrand /><UiIconButton icon="tabler:menu-2" label="Open navigation" @click="isMenuOpen = true" /></header><UiDialog v-model="isMenuOpen" title="Navigation"><ProductNav @navigate="isMenuOpen = false" /></UiDialog><main :class="$style.content"><div :class="$style.canvas"><slot /></div></main></div></template>
<script setup lang="ts">
  import AppBrand from '~/components/AppBrand.vue'
  import ProductNav from '~/components/ProductNav.vue'
  import UiDialog from '~/components/ui/UiDialog.vue'
  import UiIconButton from '~/components/ui/UiIconButton.vue'
  import { ref } from 'vue'

  const isMenuOpen = ref(false)
</script>
<style module>
  .component { min-block-size: 100vh; }
  .sidebar { display: none; }
  .mobileHeader { position: sticky; z-index: 20; top: 0; min-block-size: 4.5rem; display: flex; align-items: center; justify-content: space-between; padding: 0 var(--space-md); border-bottom: var(--outline); background: var(--color-paper); }
  .content { padding: var(--space-lg) var(--space-md) 5rem; }
  .canvas { inline-size: min(100%, 90rem); margin-inline: auto; }
  @media (min-width: 64rem) { .component { display: grid; grid-template-columns: clamp(15rem, 19vw, 17.5rem) minmax(0, 1fr); } .sidebar { position: sticky; top: 0; block-size: 100vh; display: block; border-right: var(--outline); background: var(--color-surface-muted); } .mobileHeader { display: none; } .content { padding: var(--space-lg); overflow: auto; } }
</style>
