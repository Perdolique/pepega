<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
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
