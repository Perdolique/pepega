<template>
  <div :class="$style.component">
    <Icon
      name="streamline-emojis:pig-face"
      size="2.5em"
    />

    <h1>Streamers Only</h1>

    <div :class="$style.note">
      <div>
        You need to be a streamer to manage notifications.
      </div>

      <div>
        Join our community! 🔥
      </div>
    </div>

    <SimpleButton
      :disabled="isCreating"
      @click="onStreamerClick"
    >
      Become a Streamer 🎯
    </SimpleButton>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '~/stores/user'
  import SimpleButton from '~/components/SimpleButton.vue'

  const isCreating = ref(false)
  const userStore = useUserStore()

  async function onStreamerClick() {
    isCreating.value = true

    await userStore.setStreamer(true)

    isCreating.value = false
  }
</script>

<style module>
  .component {
    display: grid;
    justify-items: center;
    row-gap: var(--spacing-16);
    text-align: center;
    text-wrap: balance;
  }

  .note {
    display: grid;
    row-gap: var(--spacing-8);
    color: var(--color-secondary);
  }
</style>
