<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <CustomToaster />
</template>

<script setup lang="ts">
  import CustomToaster from '@/components/toaster/CustomToaster.vue';

  useHead({
    link: [{
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }]
  })
</script>

<style>
  @import '~/assets/styles/base.css';
</style>
