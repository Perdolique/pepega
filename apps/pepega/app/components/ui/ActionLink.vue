<template>
  <NuxtLink
    :class="$style.component"
    :to="to"
    :external="external"
    :data-variant="variant"
  >
    <Icon
      v-if="iconName"
      :class="$style.icon"
      :name="iconName"
      aria-hidden="true"
    />

    <span :class="$style.label"><slot /></span>
  </NuxtLink>
</template>

<script setup lang="ts">
  interface Props {
    to: string;
    external?: boolean;
    iconName?: string;
    variant?: 'primary' | 'twitch';
  }

  const { variant = 'primary' } = defineProps<Props>()
</script>

<style module>
  .component {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ui-spacing-sm);
    min-block-size: var(--ui-control-min);
    padding: var(--ui-spacing-md) var(--ui-spacing-lg);
    border: var(--ui-outline);
    border-radius: var(--ui-radius-pill);
    background-color: var(--ui-color-primary);
    color: var(--ui-color-on-fill);
    box-shadow: var(--ui-shadow-button);
    font-family: var(--ui-font-display);
    font-size: var(--ui-font-size-body);
    font-weight: 700;
    line-height: 1.25;
    text-align: center;
    text-decoration: none;
    transition: background-color 120ms ease-out, box-shadow 120ms ease-out, transform 120ms ease-out;

    &[data-variant="twitch"] {
      background-color: var(--ui-color-twitch);
      color: var(--ui-color-on-twitch);
    }

    @media (hover: hover) {
      &:hover {
        background-color: var(--ui-color-primary-hover);
        box-shadow: 4px 4px 0 var(--ui-color-shadow);
        transform: translate(-1px, -1px);
      }

      &[data-variant="twitch"]:hover {
        background-color: var(--ui-color-twitch-hover);
      }
    }

    &:active {
      box-shadow: none;
      transform: translate(3px, 3px);
    }

    &:focus-visible {
      outline: var(--ui-focus-outline);
      outline-offset: 3px;
    }
  }

  .icon {
    flex: none;
    font-size: 1.25rem;
  }

  .label {
    overflow-wrap: anywhere;
  }

  @media (prefers-reduced-motion: reduce) {
    .component {
      transition: none;

      &:hover, &:active {
        transform: none;
      }
    }
  }

  @media (forced-colors: active) {
    .component {
      border-color: ButtonText;
    }
  }
</style>
