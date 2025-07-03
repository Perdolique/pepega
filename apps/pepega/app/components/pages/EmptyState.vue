<template>
  <div :class="$style.emptyState">
    <h2>
      {{ title }}
    </h2>

    <p :class="$style.description">
      {{ description }}
    </p>

    <SimpleButton
      :disabled="disabled"
      @click="emit('action')"
    >
      {{ buttonText }}
    </SimpleButton>
  </div>
</template>

<script lang="ts" setup>
  import SimpleButton from '~/components/SimpleButton.vue'

  interface Props {
    title: string;
    description: string;
    buttonText: string;
    disabled?: boolean;
  }

  type Emits = (event: 'action') => void;

  defineProps<Props>();

  const emit = defineEmits<Emits>();
</script>

<style module>
  .emptyState {
    display: grid;
    height: 100%;
    width: 100%;
    text-align: center;
    justify-items: center;
    align-content: center;
    max-width: 400px;
    justify-self: center;
  }

  .description {
    color: var(--color-secondary);
    font-size: var(--font-size-14);
  }
</style>
