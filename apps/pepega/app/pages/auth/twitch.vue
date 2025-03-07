<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <div :class="$style.progress">
        <div
          v-if="isFailed"
          :class="$style.icon"
        >
          💀
        </div>

        <FidgetSpinner
          v-else
          size="32px"
        />
      </div>

      <div v-if="isFailed">
        Failed to connect <strong>Twitch</strong>
      </div>

      <div v-else>
        Connecting <strong>Twitch</strong>...
      </div>

      <!-- TODO: style this link -->
      <NuxtLink
        v-if="isFailed"
        to="/"
      >
        Return to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { decodeStateData } from '@pepega/twitch/auth'
  import { useUserStore } from '~/stores/user'
  import FidgetSpinner from '~/components/FidgetSpinner.vue'

  definePageMeta({
    layout: false,
    skipAuth: true
  })

  const isFailed = ref(false)
  const route = useRoute()
  const userStore = useUserStore()

  async function handleConnect() {
    try {
      const result = await $fetch('/api/oauth/twitch', {
        method: 'POST',

        body: {
          code: route.query.code
        }
      })

      if (result === undefined) {
        throw new Error('Failed to connect Twitch')
      }

      userStore.updateUser(result)

      userStore.hasData = true

      const { state } = route.query
      const decodedState = decodeStateData(state)

      if (decodedState === null) {
        await navigateTo('/dashboard', {
          replace: true
        })

        return
      }

      await navigateTo(decodedState.redirectTo, {
        replace: true
      })
    } catch (error) {
      isFailed.value = true
    }
  }

  onBeforeMount(() => {
    handleConnect()
  })
</script>

<style module>
  .component {
    height: 100vh;
    display: flex;
    padding: var(--spacing-24);
  }

  .content {
    margin: auto;
    display: grid;
    row-gap: var(--spacing-16);
    justify-items: center;
    text-wrap: balance;
  }

  .progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }

  .icon {
    font-size: 32px;
  }
</style>
