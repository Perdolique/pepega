<template><UiPanel :class="$style.component" variant="quiet"><div><h2>Account role</h2><p>Streamer tools appear when Streamer mode is on. Turning it off hides those tools but does not delete saved settings.</p></div><UiSwitch v-model="streamerMode" label="Streamer mode" description="Show Twitch notification tools" /><p v-if="error" :class="$style.error" role="alert">{{ error }}</p><span v-if="isPending" :class="$style.pending" role="status">Saving role…</span></UiPanel></template>
<script setup lang="ts">
  import UiPanel from '~/components/ui/UiPanel.vue'; import UiSwitch from '~/components/ui/UiSwitch.vue'; import { useUserStore } from '~/stores/user'; import { ref, watch } from 'vue'

  const userStore = useUserStore(); const streamerMode = ref(userStore.isStreamer); const isPending = ref(false); const error = ref(''); let isRestoring = false
  watch(streamerMode, async value => { if (isRestoring) { isRestoring = false; return } isPending.value = true; error.value = ''; const success = await userStore.setStreamer(value); if (success === false) { error.value = 'Streamer mode could not be updated. Try again.'; isRestoring = true; streamerMode.value = !value } isPending.value = false })
</script>
<style module>
  .component { display: grid; gap: var(--space-lg); & h2 { font-size: 1.5rem; } & p { color: var(--color-ink-secondary); } }
  .error { color: var(--color-danger) !important; font-weight: 700; }
  .pending { color: var(--color-ink-muted); font-size: var(--text-body-sm); }
</style>
