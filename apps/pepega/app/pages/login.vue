<template>
  <section :class="$style.component">
    <Icon
      :class="$style.icon"
      name="tabler:brand-twitch"
      aria-hidden="true"
    />

    <div :class="$style.copy">
      <h1>Continue with Twitch</h1>
      <p>Twitch identifies your account so you can use Pepega.</p>
    </div>

    <UiButton
      variant="twitch"
      icon="tabler:brand-twitch"
      @click="redirectToTwitch"
    >
      Authorize with Twitch
    </UiButton>

    <NuxtLink to="/">
      Back home
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
  import UiButton from '~/components/ui/UiButton.vue'
  import {
    getRedirectTo,
    getTwitchAuthorizationPath
  } from '~/utils/router'
  import { definePageMeta, useHead, useRoute } from '#imports'

  definePageMeta({ layout: 'public' })
  useHead({ title: 'Twitch login — Pepega' })

  const route = useRoute()

  function redirectToTwitch() {
    const redirectTo = getRedirectTo(route.query.redirectTo)
    const authorizationPath = getTwitchAuthorizationPath(redirectTo)

    window.location.assign(authorizationPath)
  }
</script>

<style module>
  .component {
    inline-size: min(100%, 32rem);
    display: grid;
    justify-items: start;
    gap: var(--space-lg);
  }

  .icon {
    color: var(--color-twitch);
    font-size: 3rem;
  }

  .copy {
    display: grid;
    gap: var(--space-xs);
  }

  .copy h1 {
    font-size: clamp(2rem, 7vw, 2.75rem);
  }

  .copy p {
    max-inline-size: 42ch;
    color: var(--color-ink-secondary);
  }
</style>
