<template>
  <button
    :class="$style.component"
    :disabled="disabled"
  >
    <Icon
      v-if="iconName"
      :class="$style.icon"
      :name="iconName"
    />

    <slot />
  </button>
</template>

<script lang="ts" setup>
  interface Props {
    iconName?: string;
    disabled?: boolean;
  }

  defineProps<Props>()
</script>

<style module>
  .component {
    background-color: var(--button-color-background);
    color: var(--button-color-text);
    height: var(--button-height);
    padding: 0 var(--spacing-24);
    border-radius: var(--border-radius-12);
    display: flex;
    align-items: center;
    column-gap: var(--spacing-8);
    outline-offset: 3px;
    transition:
      background-color var(--transition-fast),
      opacity var(--transition-fast);

    &:disabled {
      opacity: var(--button-disabled-opacity);
      cursor: not-allowed;
    }

    @media (hover: hover) {
      &:hover:not(:disabled) {
        background-color: var(--button-color-hover);
      }
    }
  }

  .icon {
    font-size: 20px;
  }
</style>
