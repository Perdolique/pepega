<template>
  <button @click="redirectToTwitch">
    Login with Twitch
  </button>
</template>

<script setup lang="ts">
  const route = useRoute()

  function redirectToTwitch() {
    const { redirectTo } = route.query
    const queryParam = redirectTo ? `?redirectTo=${redirectTo}` : ''

    window.location.replace(`/api/oauth/twitch${queryParam}`)
  }
</script>
