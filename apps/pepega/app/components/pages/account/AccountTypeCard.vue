<template>
  <section :class="$style.component">
    <div>
      <h2>Streamer mode</h2>
      <p>Show tools made for streamers. Turning this off keeps saved settings.</p>
    </div>

    <SwitchRoot
      v-model="streamerMode"
      :class="$style.switch"
      aria-label="Streamer mode"
    >
      <SwitchThumb :class="$style.thumb" />
    </SwitchRoot>

    <p
      v-if="error"
      :class="$style.error"
      role="alert"
    >
      {{ error }}
    </p>
    <span
      v-if="isPending"
      :class="$style.pending"
      role="status"
    >
      Saving…
    </span>
  </section>
</template>

<script setup lang="ts">
  import { useUserStore } from '~/stores/user'
  import { SwitchRoot, SwitchThumb } from 'reka-ui'
  import { ref, watch } from 'vue'

  const userStore = useUserStore()
  const streamerMode = ref(userStore.isStreamer)
  const isPending = ref(false)
  const error = ref('')
  let isRestoring = false

  watch(streamerMode, async (value) => {
    if (isRestoring) {
      isRestoring = false
      return
    }

    isPending.value = true
    error.value = ''

    const success = await userStore.setStreamer(value)

    if (success === false) {
      error.value = 'Streamer mode could not be updated. Try again.'
      isRestoring = true
      streamerMode.value = !value
    }

    isPending.value = false
  })
</script>

<style module>
  .component {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--space-md) var(--space-lg);
  }

  .component h2 {
    font-size: 1.25rem;
  }

  .component p {
    color: var(--color-ink-secondary);
  }

  .switch {
    inline-size: 3.25rem;
    block-size: 1.875rem;
    padding: 0.1875rem;
    border: 2px solid var(--color-ink);
    border-radius: var(--radius-full);
    background: var(--color-surface-muted);
  }

  .switch[data-state="checked"] {
    background: var(--color-mint);
  }

  .thumb {
    display: block;
    inline-size: 1.25rem;
    block-size: 1.25rem;
    border-radius: 50%;
    background: var(--color-ink);
    transition: transform var(--motion-fast);
  }

  .thumb[data-state="checked"] {
    transform: translateX(1.375rem);
  }

  .error,
  .pending {
    grid-column: 1 / -1;
    font-size: var(--text-body-sm);
  }

  .component .error {
    color: var(--color-danger);
    font-weight: 700;
  }

  .pending {
    color: var(--color-ink-muted);
  }
</style>
