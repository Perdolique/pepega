<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <CustomToaster />
</template>

<script setup lang="ts">
  import CustomToaster from '@/components/toaster/CustomToaster.vue';
  import { useThemePreference } from '~/composables/use-theme-preference';
  import { useHead } from '#imports';

  const { preference } = useThemePreference()

  useHead(() => ({
    htmlAttrs: {
      'data-theme': preference.value
    }
  }))

  useHead({
    link: [{
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }]
  })
</script>

<style>
  @import '~/assets/styles/reset.css';
  @import '~/assets/styles/theme.css';
  @import '~/assets/styles/base.css';
</style>
