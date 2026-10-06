<template>
  <div ref="feedback" :class="$style.component">
    <p :role="feedbackRole">{{ message }}</p>

    <SimpleButton
      :class="[$style.retry, { isRetrying }]"
      :aria-disabled="isRetrying"
      @click="onRetry"
    >
      Try again
    </SimpleButton>
  </div>
</template>

<script setup lang="ts">
  import SimpleButton from '~/components/SimpleButton.vue'
  import { computed, nextTick, onBeforeUnmount, useTemplateRef } from 'vue'

  interface Props {
    message: string;
    isRetrying: boolean;
    isBlocking: boolean;
    restoreFocus: () => void;
  }

  type Emits = (event: 'retry') => void

  const { isRetrying, isBlocking, restoreFocus } = defineProps<Props>()
  const emit = defineEmits<Emits>()
  const feedback = useTemplateRef('feedback')
  const feedbackRole = computed(() => isBlocking ? 'alert' : 'status')

  onBeforeUnmount(() => {
    const ownsFocus = feedback.value?.contains(document.activeElement) ?? false

    if (ownsFocus) {
      void nextTick(() => {
        const isFocusUnset = document.activeElement === document.body

        if (isFocusUnset) {
          restoreFocus()
        }
      })
    }
  })

  function onRetry() {
    if (isRetrying) {
      return
    }

    emit('retry')
  }
</script>

<style module>
  .component {
    display: grid;
    justify-items: start;
    gap: var(--spacing-8);
  }

  .retry {
    &:global(.isRetrying) {
      opacity: var(--button-disabled-opacity);
      cursor: wait;
    }
  }
</style>
