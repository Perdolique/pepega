<template>
  <NuxtLink
    to="/dashboard"
    v-if="userStore.isAuthenticated"
  >
    Dashboard
  </NuxtLink>

  <NuxtLink
    to="/login"
    v-else
  >
    Login
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { useUserStore } from '~/stores/user';

  const userStore = useUserStore();
</script>
