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
  import { useUserStore } from '~/stores/user'
  import FidgetSpinner from '~/components/FidgetSpinner.vue'
  import { decodeStateData } from '~~/server/utils/provider-twitch'

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

      userStore.userId = result.userId
      userStore.hasData = true

      const { state } = route.query
      const { redirectTo } = decodeStateData(state)

      await navigateTo(redirectTo, {
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
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    padding: var(--spacing-24);
  }

  .content {
    display: grid;
    row-gap: var(--spacing-16);
    margin: auto;
    justify-items: center;
    text-align: center;
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
