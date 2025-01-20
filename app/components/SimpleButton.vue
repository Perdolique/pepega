<template>
  <button :class="$style.component">
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
    transition: background-color var(--transition-fast);
    outline-offset: 3px;

    @media (hover: hover) {
      &:hover {
        background-color: var(--button-color-hover);
      }
    }
  }

  .icon {
    font-size: 20px;
  }
</style>
