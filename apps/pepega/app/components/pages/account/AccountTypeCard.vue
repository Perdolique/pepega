<template>
  <BaseCard :class="$style.card">
    <h3>
      Account type
    </h3>

    <SimpleButton
      v-if="isStreamer"
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
  import SimpleButton from '~/components/SimpleButton.vue'
  import BaseCard from '~/components/BaseCard.vue'

  interface Props {
    isPending: boolean;
    isStreamer: boolean;
  }

  type Emits = (event: 'toggle') => void;

  defineProps<Props>()

  const emit = defineEmits<Emits>()

  function onClick() {
    emit('toggle')
  }
</script>

<style module>
  .card {
    display: grid;
    row-gap: var(--spacing-16);
    justify-content: start;
  }
</style>
