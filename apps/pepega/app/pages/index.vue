<template>
  <section :class="$style.component">
    <h1 :class="$style.title">Sign in</h1>

    <ActionLink
      :to="loginUrl"
      icon-name="tabler:brand-twitch"
      variant="twitch"
      external
    >Continue with Twitch</ActionLink>
  </section>
</template>

<script setup lang="ts">
  import ActionLink from '~/components/ui/ActionLink.vue'
  import { getTwitchLoginUrl } from '~/utils/router'
  import { computed, onMounted, ref } from 'vue'
  import { definePageMeta, useHead, useRoute } from '#imports'

  definePageMeta({ layout: 'paper' })

  useHead({ title: 'Sign in | Pepega' })

  const route = useRoute()
  const inheritedHash = ref('')
  const loginUrl = computed(() => getTwitchLoginUrl(route.query.redirectTo, inheritedHash.value))

  onMounted(() => {
    // HTTP redirects keep fragments in the browser, outside the server's return query.
    inheritedHash.value = route.hash
  })
</script>

<style module>
  .component {
    display: grid;
    gap: var(--ui-spacing-2xl);
    inline-size: 100%;
    max-inline-size: 480px;
    padding: var(--ui-spacing-xl);
    border: var(--ui-outline);
    border-radius: var(--ui-radius-card);
    background-color: var(--ui-color-surface);
    box-shadow: var(--ui-shadow-panel);
  }

  .title {
    font-family: var(--ui-font-display);
    font-size: var(--ui-font-size-title);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.01em;
    text-align: center;
  }

  @media (width < 640px) {
    .component {
      gap: var(--ui-spacing-xl);
      padding: var(--ui-spacing-lg);
    }

    .title {
      line-height: 1.2;
    }
  }
</style>
