<template>
  <BaseCard :class="$style.card">
    <h3>
      Account type
    </h3>

    <SimpleButton
      v-if="userStore.isStreamer"
      :disabled="isPending"
      @click="onClick"
    >
      I am viewer!
    </SimpleButton>

    <SimpleButton
      v-else
      :disabled="isPending"
      @click="onClick"
    >
      I am streamer!
    </SimpleButton>
  </BaseCard>
</template>

<script lang="ts" setup>
  import { useUserStore } from '~/stores/user'
  import SimpleButton from '~/components/SimpleButton.vue'
  import BaseCard from '~/components/BaseCard.vue'

  const isPending = ref(false)
  const userStore = useUserStore()

  async function onClick() {
    isPending.value = true

    if (userStore.isStreamer) {
      await userStore.setStreamer(false)
    } else {
      await userStore.setStreamer(true)
    }

    isPending.value = false
  }
</script>

<style module>
  .card {
    display: grid;
    row-gap: var(--spacing-16);
    justify-content: start;
  }
</style>
