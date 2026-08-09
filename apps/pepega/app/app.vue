<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UiToastViewport />
</template>

<script setup lang="ts">
  import UiToastViewport from '~/components/ui/UiToastViewport.vue'
  import { useTheme } from '~/composables/use-theme'
  import { useHead } from '#imports';

  const { theme } = useTheme()

  useHead({
    htmlAttrs: {
      'data-theme': theme
    },
    link: [{
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }]
  })
</script>

<style>
  @import '~/assets/styles/tokens.css';
  @import '~/assets/styles/base.css';
</style>
