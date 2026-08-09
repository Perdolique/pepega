<template><div :class="$style.component"><UiPanel :class="$style.card"><Icon :class="$style.icon" name="tabler:brand-twitch" aria-hidden="true" /><div :class="$style.copy"><h1>Continue with Twitch</h1><p>Pepega uses Twitch to identify your account and connect live notifications. We never ask for your Twitch password.</p></div><UiButton variant="twitch" icon="tabler:brand-twitch" @click="redirectToTwitch">Authorize with Twitch</UiButton><NuxtLink to="/">Back home</NuxtLink></UiPanel></div></template>
<script setup lang="ts">
  import UiButton from '~/components/ui/UiButton.vue'
  import UiPanel from '~/components/ui/UiPanel.vue'
  import { definePageMeta, useHead, useRoute } from '#imports'

  definePageMeta({ layout: 'public', skipAuth: true }); useHead({ title: 'Twitch login — Pepega' }); const route = useRoute()
  function redirectToTwitch() { const redirectTo = typeof route.query.redirectTo === 'string' ? route.query.redirectTo : undefined; const search = redirectTo === undefined ? '' : `?${new URLSearchParams({ redirectTo })}`; window.location.assign(`/api/oauth/twitch${search}`) }
</script>
<style module>
  .component { display: grid; place-items: center; }
  .card { inline-size: min(100%, 32rem); display: grid; justify-items: start; gap: var(--space-lg); }
  .icon { padding: var(--space-sm); border-radius: var(--radius-inner); background: var(--color-twitch); color: white; font-size: 3.5rem; }
  .copy { display: grid; gap: var(--space-xs); & h1 { font-size: 2.5rem; } & p { color: var(--color-ink-secondary); } }
</style>
