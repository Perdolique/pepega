export const useStreamerStore = defineStore('streamer', () => {
  const id = ref<number | null>(null)
  const broadcasterId = ref<string | null>(null)
  const isStreamer = computed(() => id.value !== null)
  const isCreatingStreamer = ref(false)

  async function fetchStreamer() {
    const { data } = await useFetch('/api/streamer')

    if (data.value !== undefined) {
      id.value = data.value.id
      broadcasterId.value = data.value.broadcasterId
    } else {
      id.value = null
      broadcasterId.value = null
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
      broadcasterId.value = result.broadcasterId
    } catch (error) {
      logger.error(error)
    } finally {
      isCreatingStreamer.value = false
    }
  }

  async function deleteStreamer() {
    const previousId = id.value
    const previousTwitchId = broadcasterId.value

    id.value = null
    broadcasterId.value = null

    try {
      await $fetch('/api/streamer', {
        method: 'DELETE'
      })
    } catch (error) {
      id.value = previousId
      broadcasterId.value = previousTwitchId

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
    broadcasterId
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useStreamerStore, import.meta.hot)
  )
}
