<template>
  <section :class="$style.component">
    <img
      :class="$style.mascot"
      src="/pepega.webp"
      alt=""
      width="112"
      height="112"
    >

    <div :class="$style.copy">
      <h1>Pepega</h1>
      <p>Twitch tools for streamers and viewers.</p>
    </div>

    <UiButtonLink
      :to="actionTo"
      :variant="actionVariant"
      icon="tabler:brand-twitch"
      :external="isExternalAction"
    >
      {{ actionLabel }}
    </UiButtonLink>
  </section>
</template>

<script setup lang="ts">
  import UiButtonLink from '~/components/ui/UiButtonLink.vue'
  import { useUserStore } from '~/stores/user'
  import { computed } from 'vue'
  import { definePageMeta, useHead } from '#imports'

  definePageMeta({
    layout: 'public',
    skipAuth: true
  })

  useHead({ title: 'Pepega — Twitch tools' })

  const userStore = useUserStore()
  const actionLabel = computed(
    () => userStore.isAuthenticated ? 'Open dashboard' : 'Continue with Twitch'
  )
  const actionTo = computed(
    () => userStore.isAuthenticated ? '/dashboard' : '/api/oauth/twitch'
  )
  const actionVariant = computed(
    () => userStore.isAuthenticated ? 'primary' as const : 'twitch' as const
  )
  const isExternalAction = computed(() => userStore.isAuthenticated === false)
</script>

<style module>
  .component {
    inline-size: min(100%, 32rem);
    display: grid;
    justify-items: start;
    gap: var(--space-lg);
  }

  .mascot {
    inline-size: 7rem;
    block-size: 7rem;
    object-fit: contain;
  }

  .copy {
    display: grid;
    gap: var(--space-xs);
  }

  .copy h1 {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
    line-height: 1;
  }

  .copy p {
    color: var(--color-ink-secondary);
    font-size: var(--text-body-lg);
  }
</style>
