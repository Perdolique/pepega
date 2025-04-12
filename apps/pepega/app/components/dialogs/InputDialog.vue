<template>
  <ModalDialog v-model="isOpened">
    <form
      method="dialog"
      :class="$style.content"
      @submit="handleSubmit"
    >
      <div :class="$style.header">
        {{ headerText }}
      </div>

      <TextInput
        required
        autofocus
        ref="textInputRef"
        v-model.trim="input"
        :placeholder="placeholder"
        :class="$style.input"
        :minlength="minlength"
        :maxlength="maxlength"
      />

      <div :class="$style.buttons">
        <SimpleButton
          type="button"
          @click="handleCancelClick"
        >
          Cancel
        </SimpleButton>

        <SimpleButton>
          {{ addButtonText }}
        </SimpleButton>
      </div>
    </form>
  </ModalDialog>
</template>

<script lang="ts" setup>
  import SimpleButton from '~/components/SimpleButton.vue'
  import TextInput from '~/components/TextInput.vue'
  import ModalDialog from './ModalDialog.vue'

  interface Props {
    readonly headerText: string;
    readonly placeholder: string;
    readonly addButtonText: string;
    readonly minlength: number;
    readonly maxlength: number;
    readonly initialValue?: string;
  }

  type Emits = (event: 'submit', input: string) => void

  const { initialValue = '' } = defineProps<Props>()
  const textInputRef = useTemplateRef('textInputRef')
  const emit = defineEmits<Emits>()
  const input = ref(initialValue)

  const isOpened = defineModel<boolean>({
    required: true
  })

  function handleCancelClick() {
    isOpened.value = false
  }

  function handleSubmit(event: Event) {
    if (input.value !== '') {
      emit('submit', input.value)
    }
  }

  // Reset form when dialog is opened
  watch(isOpened, (opened) => {
    if (opened) {
      // Reset input field to initial value
      if (input.value !== initialValue) {
        input.value = initialValue
      }

      // Select text in input field if it's not empty
      nextTick(() => {
        if (input.value !== '') {
          textInputRef.value?.$el.select()
        }
      })
    }
  })
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

  .header {
    font-size: var(--font-size-20);
    font-weight: var(--font-weight-medium);
    text-align: center;
  }

  .input {
    text-align: center;
  }

  .buttons {
    display: grid;
    grid-auto-flow: column;
    column-gap: var(--spacing-16);
  }
</style>
