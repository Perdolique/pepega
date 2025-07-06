<template>
  <NuxtLink
    :to="to"
    :external="external"
    :target="target"
    :class="[$style.component, variant]"
  >
    <Icon
      v-if="iconName"
      :class="$style.icon"
      :name="iconName"
    />

    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
  interface Props {
    to: string;
    iconName?: string;
    variant?: 'primary' | 'secondary';
    external?: boolean;
    target?: '_blank' | '_self' | '_parent' | '_top';
  }

  const {
    variant = 'primary',
    external = false,
    target = undefined
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
    text-decoration: none;
    transition:
      background-color var(--button-transition),
      opacity var(--button-transition);

    background-color: var(--button-primary-color-bg);
    color: var(--button-primary-color-text);

    @media (hover: hover) {
      &:hover {
        background-color: var(--button-primary-color-hover);
      }
    }

    &:active {
      background-color: var(--button-primary-color-active);
    }

    &:global(.secondary) {
      background-color: var(--button-secondary-color-bg);
      color: var(--button-secondary-color-text);

      @media (hover: hover) {
        &:hover {
          background-color: var(--button-secondary-color-hover);
        }
      }

      &:active {
        background-color: var(--button-secondary-color-active);
      }
    }
  }

  .icon {
    font-size: var(--button-icon-size);
  }
</style>
