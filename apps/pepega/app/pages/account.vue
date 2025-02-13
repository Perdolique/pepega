<template>
  <h2>Account page</h2>

  <SimpleButton
    v-if="streamerStore.isStreamer"
    @click="streamerStore.deleteStreamer"
  >
    I am viewer!
  </SimpleButton>

  <SimpleButton
    v-else
    :disabled="isCreatingStreamer"
    @click="onMakeStreamerClick"
  >
    I am streamer!
  </SimpleButton>
</template>

<script setup lang="ts">
  import SimpleButton from '~/components/SimpleButton.vue'
  import { useStreamerStore } from '~/stores/streamer'

  const isCreatingStreamer = ref(false)
  const streamerStore = useStreamerStore()

  await streamerStore.fetchStreamer()

  async function onMakeStreamerClick() {
    isCreatingStreamer.value = true

    await streamerStore.createStreamer()

    isCreatingStreamer.value = false
  }
</script>
