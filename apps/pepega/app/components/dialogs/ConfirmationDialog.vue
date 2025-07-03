<template>
  <ModalDialog
    v-model="isOpened"
    :title="headerText"
  >
    <slot />

    <div :class="$style.buttons">
      <SimpleButton
        variant="secondary"
        :class="$style.button"
        @click="close"
      >
        {{ cancelButtonText }}
      </SimpleButton>

      <SimpleButton
        :class="$style.button"
        @click="emitConfirm"
      >
        {{ confirmButtonText }}
      </SimpleButton>
    </div>
  </ModalDialog>
</template>

<script lang="ts" setup>
  import SimpleButton from '~/components/SimpleButton.vue'
  import ModalDialog from './ModalDialog.vue'

  interface Props {
    readonly headerText: string;
    readonly confirmButtonText: string;
    readonly cancelButtonText?: string;
  }

  type Emits = (event: 'confirm') => void

  const isOpened = defineModel<boolean>({
    required: true
  })

  const {
    cancelButtonText = 'Cancel'
  } = defineProps<Props>()

  const emit = defineEmits<Emits>()

  function close() {
    isOpened.value = false
  }

  function emitConfirm() {
    emit('confirm')

    close()
  }
</script>

<style module>
  .content {
    display: grid;
    row-gap: var(--spacing-24);
    background-color: var(--dialog-color-background);
    padding: var(--dialog-padding);
    border-radius: var(--dialog-border-radius);
    border: 1px solid var(--dialog-color-border);
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--spacing-16);
  }

  .button {
    max-width: 200px;
  }
</style>
