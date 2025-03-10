<template>
  <h2>Account page</h2>

  <SimpleButton
    v-if="userStore.isStreamer"
    :disabled="isPending"
    @click="onSetViewerClick"
  >
    I am viewer!
  </SimpleButton>

  <SimpleButton
    v-else
    :disabled="isPending"
    @click="onSetStreamerClick"
  >
    I am streamer!
  </SimpleButton>
</template>

<script setup lang="ts">
  import SimpleButton from '~/components/SimpleButton.vue'
  import { useUserStore } from '~/stores/user'

  const isPending = ref(false)
  const userStore = useUserStore()

  async function onSetStreamerClick() {
    isPending.value = true

    await userStore.setStreamer(true)

    isPending.value = false
  }

  async function onSetViewerClick() {
    isPending.value = true

    await userStore.setStreamer(false)

    isPending.value = false
  }
</script>
