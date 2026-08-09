<template><div :class="$style.component"><section :class="$style.hero"><div :class="$style.copy"><p :class="$style.kicker">TWITCH → TELEGRAM</p><h1 :class="$style.title">Your stream goes live.<br />Your people know.</h1><p :class="$style.lead">Pepega connects your Twitch channel to Telegram and sends the alert when you go live.</p><UiButtonLink :to="ctaTo" :variant="ctaVariant" icon="tabler:brand-twitch">{{ ctaLabel }}</UiButtonLink></div><UiPanel :class="$style.sticker" variant="featured"><img :class="$style.mascot" src="/pepega.webp" alt="" /><strong>Live alerts, no fuss.</strong><span>One useful notification. Right where your community already hangs out.</span></UiPanel></section><section :class="$style.steps" aria-labelledby="steps-title"><h2 id="steps-title" :class="$style.sectionTitle">Three steps. One loud entrance.</h2><ol :class="$style.stepList"><li><Icon :class="$style.stepIcon" name="tabler:brand-twitch" aria-hidden="true" /><strong>Connect Twitch</strong><span :class="$style.stepCopy">Sign in safely with your Twitch account.</span></li><li><Icon :class="$style.stepIcon" name="tabler:brand-telegram" aria-hidden="true" /><strong>Add a Telegram channel</strong><span :class="$style.stepCopy">Verify the channel where alerts belong.</span></li><li><Icon :class="$style.stepIcon" name="tabler:bell-ringing" aria-hidden="true" /><strong>Send live alerts</strong><span :class="$style.stepCopy">Choose the message and Pepega does the rest.</span></li></ol></section></div></template>
<script setup lang="ts">
  import UiButtonLink from '~/components/ui/UiButtonLink.vue'
  import UiPanel from '~/components/ui/UiPanel.vue'
  import { useUserStore } from '~/stores/user'
  import { computed } from 'vue'
  import { definePageMeta, useHead } from '#imports'

  definePageMeta({ layout: 'public', skipAuth: true })
  useHead({ title: 'Pepega — Twitch live alerts for Telegram' })
  const userStore = useUserStore()
  const ctaLabel = computed(() => userStore.isAuthenticated ? 'Open dashboard' : 'Continue with Twitch')
  const ctaTo = computed(() => userStore.isAuthenticated ? '/dashboard' : '/login')
  const ctaVariant = computed(() => userStore.isAuthenticated ? 'primary' as const : 'twitch' as const)
</script>
<style module>
  .component { display: grid; gap: var(--space-section); }
  .hero { display: grid; align-items: center; gap: var(--space-xl); }
  .copy { display: grid; justify-items: start; gap: var(--space-lg); }
  .kicker { color: var(--color-primary); font: 700 0.6875rem/1.4 var(--font-metadata); letter-spacing: 0.08em; }
  .title { max-inline-size: 12ch; font-size: clamp(3rem, 8vw, 4rem); font-weight: 800; line-height: 0.96; letter-spacing: -0.04em; }
  .lead { max-inline-size: 38rem; color: var(--color-ink-secondary); font-size: var(--text-body-lg); }
  .sticker { display: grid; justify-items: center; gap: var(--space-sm); text-align: center; transform: rotate(1deg); & strong { font: 800 1.75rem/1.1 var(--font-display); } & span { max-inline-size: 24rem; color: var(--color-ink-secondary); } }
  .mascot { inline-size: min(18rem, 70vw); aspect-ratio: 1; object-fit: contain; }
  .steps { display: grid; gap: var(--space-lg); }
  .sectionTitle { font-size: 1.75rem; }
  .stepList { display: grid; gap: var(--space-md); margin: 0; padding: 0; list-style: none; counter-reset: step; & li { display: grid; grid-template-columns: 2.75rem minmax(0, 1fr); gap: 0 var(--space-md); padding: var(--space-lg); border: var(--outline); border-radius: var(--radius-card); background: var(--color-surface); } & strong { grid-column: 2; font-family: var(--font-display); font-size: 1.125rem; } }
  .stepIcon { grid-row: 1 / span 2; padding: var(--space-xs); border-radius: var(--radius-control); background: var(--color-sun); font-size: 2.75rem; }
  .stepCopy { grid-column: 2; color: var(--color-ink-secondary); }
  @media (min-width: 48rem) { .hero { grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr); } .stepList { grid-template-columns: repeat(3, 1fr); } }
</style>
