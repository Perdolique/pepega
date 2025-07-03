<template>
  <input
    type="text"
    ref="input"
    :class="$style.component"
    v-model="model"
  />
</template>

<script lang="ts" setup>
  const model = defineModel({
    required: true
  })

  const input = useTemplateRef('input')

  function focus() {
    input.value?.focus()
  }

  defineExpose({
    focus
  })
</script>

<style module>
  .component {
    appearance: none;
    width: 100%;
    outline: none;
    height: var(--input-height);
    padding: 0 var(--input-padding-horizontal);
    font-size: var(--input-font-size);
    color: var(--input-color-text);
    background-color: var(--input-color-background);
    border-radius: var(--input-border-radius);
    border: 1px solid var(--input-color-border);
    transition: border-color var(--transition-fast) ease-out;

    &:hover:not(:disabled),
    &:focus-visible {
      border-color: var(--input-color-focus);
    }

    &:disabled {
      opacity: var(--input-opacity-disabled);
    }
  }

  .component::placeholder {
    color: var(--input-color-placeholder);
    user-select: none;
  }
</style>
