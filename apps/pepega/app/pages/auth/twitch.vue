<template>
  <section :class="$style.component">
    <div
      v-if="isFailed"
      :class="$style.status"
    >
      <Icon
        :class="$style.failureIcon"
        name="tabler:plug-connected-x"
        aria-hidden="true"
      />
      <h1>Twitch did not connect</h1>
      <p>{{ failureMessage }}</p>

      <div :class="$style.actions">
        <UiButton
          variant="twitch"
          @click="startNewAuthorization"
        >
          Try again
        </UiButton>
        <UiButtonLink
          to="/"
          variant="ghost"
        >
          Back home
        </UiButtonLink>
      </div>
    </div>

    <div
      v-else
      :class="$style.status"
      role="status"
      aria-live="polite"
    >
      <span
        :class="$style.spinner"
        aria-hidden="true"
      />
      <h1>Connecting Twitch</h1>
      <p>Checking your authorization…</p>
    </div>
  </section>
</template>

<script setup lang="ts">
  import UiButton from '~/components/ui/UiButton.vue'
  import UiButtonLink from '~/components/ui/UiButtonLink.vue'
  import {
    getOAuthRedirectTo,
    getTwitchAuthorizationPath
  } from '~/utils/router'
  import { useUserStore } from '~/stores/user'
  import { onMounted, ref } from 'vue'
  import {
    $fetch,
    definePageMeta,
    navigateTo,
    useHead,
    useRoute
  } from '#imports'

  const defaultFailureMessage = 'Authorization could not be completed. Try again.'

  definePageMeta({
    layout: 'public',
    skipAuth: true
  })

  useHead({ title: 'Connecting Twitch — Pepega' })

  const route = useRoute()
  const userStore = useUserStore()
  const isFailed = ref(false)
  const failureMessage = ref(defaultFailureMessage)
  const redirectTo = getOAuthRedirectTo(route.query.state)
  const code = typeof route.query.code === 'string' ? route.query.code : ''

  function startNewAuthorization() {
    const authorizationPath = getTwitchAuthorizationPath(redirectTo)

    window.location.assign(authorizationPath)
  }

  async function completeAuthorization() {
    if (code.length === 0) {
      failureMessage.value = 'Twitch did not return an authorization code.'
      isFailed.value = true
      return
    }

    try {
      const result = await $fetch('/api/oauth/twitch', {
        method: 'POST',
        body: { code }
      })

      userStore.updateUser(result)
      userStore.hasData = true

      await navigateTo(redirectTo, { replace: true })
    } catch (error) {
      console.error('Failed to connect Twitch', error)
      isFailed.value = true
    }
  }

  onMounted(completeAuthorization)
</script>

<style module>
  .component {
    inline-size: min(100%, 34rem);
    min-block-size: 18rem;
    display: grid;
    align-items: center;
  }

  .status {
    display: grid;
    justify-items: start;
    gap: var(--space-md);
  }

  .status h1 {
    font-size: clamp(2rem, 7vw, 2.75rem);
  }

  .status p {
    color: var(--color-ink-secondary);
  }

  .failureIcon {
    color: var(--color-danger);
    font-size: 3rem;
  }

  .spinner {
    inline-size: 3rem;
    block-size: 3rem;
    border: 0.3rem solid var(--color-surface-muted);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .actions {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
</style>
