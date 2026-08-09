<template><header :class="$style.component"><AppBrand /><nav :class="$style.actions" aria-label="Public navigation"><UiThemeMenu /><UiButtonLink :to="actionTo" :variant="actionVariant">{{ actionLabel }}</UiButtonLink></nav></header></template>
<script setup lang="ts">
  import AppBrand from './AppBrand.vue'
  import UiButtonLink from './ui/UiButtonLink.vue'
  import UiThemeMenu from './ui/UiThemeMenu.vue'
  import { useUserStore } from '~/stores/user'
  import { computed } from 'vue'

  const userStore = useUserStore()
  const actionLabel = computed(() => userStore.isAuthenticated ? 'Open dashboard' : 'Log in')
  const actionTo = computed(() => userStore.isAuthenticated ? '/dashboard' : '/login')
  const actionVariant = computed(() => userStore.isAuthenticated ? 'primary' as const : 'ghost' as const)
</script>
<style module>
  .component { min-block-size: 4.5rem; display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); }
  .actions { display: flex; align-items: center; gap: var(--space-xs); }
</style>
