<template><div :class="$style.component"><UiPanel :class="$style.card"><div v-if="isFailed" :class="$style.failure"><Icon name="tabler:plug-connected-x" aria-hidden="true" /><h1>Twitch did not connect</h1><p>{{ failureMessage }}</p><div :class="$style.actions"><UiButton variant="twitch" @click="handleConnect">Try again</UiButton><UiButtonLink to="/" variant="ghost">Back home</UiButtonLink></div></div><div v-else :class="$style.loading" role="status" aria-live="polite"><span :class="$style.spinner" aria-hidden="true" /><h1>Connecting Twitch</h1><p>Checking your authorization and preparing the dashboard…</p></div></UiPanel></div></template>
<script setup lang="ts">
  import { decodeStateData } from '@pepega/twitch/auth'
  import UiButton from '~/components/ui/UiButton.vue'; import UiButtonLink from '~/components/ui/UiButtonLink.vue'; import UiPanel from '~/components/ui/UiPanel.vue'; import { useUserStore } from '~/stores/user'
  import { onMounted, ref } from 'vue'; import { $fetch, definePageMeta, navigateTo, useHead, useRoute } from '#imports'

  definePageMeta({ layout: 'public', skipAuth: true }); useHead({ title: 'Connecting Twitch — Pepega' })
  const isFailed = ref(false); const failureMessage = ref('Authorization could not be completed. Your account was not changed.'); const route = useRoute(); const userStore = useUserStore()
  async function handleConnect() { isFailed.value = false; try { const code = typeof route.query.code === 'string' ? route.query.code : ''; if (code.length === 0) {throw new Error('Missing Twitch authorization code');} const result = await $fetch('/api/oauth/twitch', { method: 'POST', body: { code } }); userStore.updateUser(result); userStore.hasData = true; const decodedState = decodeStateData(route.query.state); const redirectTo = decodedState?.redirectTo ?? '/dashboard'; await navigateTo(redirectTo, { replace: true }) } catch (error) { console.error('Failed to connect Twitch', error); isFailed.value = true } }
  onMounted(handleConnect)
</script>
<style module>
  .component { min-block-size: 60vh; display: grid; place-items: center; }
  .card { inline-size: min(100%, 34rem); text-align: center; }
  .loading, .failure { display: grid; justify-items: center; gap: var(--space-md); & > svg { font-size: 3rem; color: var(--color-danger); } & p { color: var(--color-ink-secondary); } }
  .spinner { inline-size: 3rem; block-size: 3rem; border: 0.35rem solid var(--color-surface-muted); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
  .actions { display: flex; justify-content: center; gap: var(--space-sm); flex-wrap: wrap; }
  @keyframes spin { to { transform: rotate(1turn); } }
</style>
