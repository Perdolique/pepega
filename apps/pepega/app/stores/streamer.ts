export const useStreamerStore = defineStore('streamer', () => {
  const id = ref<number | null>(null)
  const twitchBroadcasterId = ref<string | null>(null)
  const isStreamer = computed(() => id.value !== null)
  const isCreatingStreamer = ref(false)

  async function fetchStreamer() {
    const { data } = await useFetch('/api/streamer')

    if (data.value !== undefined) {
      id.value = data.value.id
      twitchBroadcasterId.value = data.value.twitchBroadcasterId
    } else {
      id.value = null
      twitchBroadcasterId.value = null
    }
  }

  async function createStreamer() {
    if (isCreatingStreamer.value) {
      return
    }

    try {
      isCreatingStreamer.value = true

      const result = await $fetch('/api/streamer', {
        method: 'POST'
      })

      id.value = result.id
      twitchBroadcasterId.value = result.twitchBroadcasterId
    } catch (error) {
      logger.error(error)
    } finally {
      isCreatingStreamer.value = false
    }
  }

  async function deleteStreamer() {
    const previousId = id.value
    const previousTwitchId = twitchBroadcasterId.value

    id.value = null
    twitchBroadcasterId.value = null

    try {
      await $fetch('/api/streamer', {
        method: 'DELETE'
      })
    } catch (error) {
      id.value = previousId
      twitchBroadcasterId.value = previousTwitchId

      logger.error(error)
    }
  }

  return {
    createStreamer,
    deleteStreamer,
    fetchStreamer,
    id,
    isCreatingStreamer,
    isStreamer,
    twitchBroadcasterId
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useStreamerStore, import.meta.hot)
  )
}
