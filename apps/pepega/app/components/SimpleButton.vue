<template>
  <button
    :class="[$style.component, variant]"
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
    variant?: 'primary' | 'secondary';
  }

  const {
    variant = 'primary'
  } = defineProps<Props>()
</script>

<style module>
  .component {
    height: var(--button-height);
    padding: 0 var(--button-padding-x);
    border-radius: var(--button-border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--button-gap);
    outline-offset: var(--button-outline-offset);
    transition:
      background-color var(--button-transition),
      opacity var(--button-transition);

    background-color: var(--button-primary-color-bg);
    color: var(--button-primary-color-text);

    &:disabled {
      opacity: var(--button-disabled-opacity);
      cursor: not-allowed;
    }

    @media (hover: hover) {
      &:hover:not(:disabled) {
        background-color: var(--button-primary-color-hover);
      }
    }

    &:active:not(:disabled) {
      background-color: var(--button-primary-color-active);
    }

    &:global(.secondary) {
      background-color: var(--button-secondary-color-bg);
      color: var(--button-secondary-color-text);

      @media (hover: hover) {
        &:hover:not(:disabled) {
          background-color: var(--button-secondary-color-hover);
        }
      }

      &:active:not(:disabled) {
        background-color: var(--button-secondary-color-active);
      }
    }
  }

  .icon {
    font-size: var(--button-icon-size);
  }
</style>
