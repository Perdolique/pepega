<template>
  <ModalDialog
    v-model="isOpened"
    :title="headerText"
  >
    <form
      :class="$style.form"
      @submit.prevent="handleSubmit"
    >
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
          variant="secondary"
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
  import ModalDialog from './ModalDialog.vue';

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
  const emit = defineEmits<Emits>()
  const input = ref(initialValue)

  const isOpened = defineModel<boolean>({
    required: true
  })

  function handleCancelClick() {
    isOpened.value = false
  }

  function handleSubmit() {
    if (input.value !== '') {
      emit('submit', input.value)

      isOpened.value = false
    }
  }

  // Reset form when dialog is opened
  watch(isOpened, (opened) => {
    if (opened) {
      // Reset input field to initial value
      if (input.value !== initialValue) {
        input.value = initialValue
      }
    }
  })
</script>

<style module>
  .form {
    display: grid;
    row-gap: var(--spacing-24);
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
