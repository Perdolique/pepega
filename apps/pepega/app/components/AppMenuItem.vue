<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[$style.component, 'link']"
    exact-active-class="active"
  >
    <Icon
      :class="$style.icon"
      :name="icon"
    />

    <slot />
  </NuxtLink>

  <button
    v-else
    type="button"
    :class="[$style.component, 'button']"
  >
    <Icon
      :class="$style.icon"
      :name="icon"
    />

    <slot />
  </button>
</template>

<script lang="ts" setup>
  interface Props {
    to?: string;
    icon: string;
  }

  defineProps<Props>()
</script>

<style module>
  .component {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: var(--spacing-8);
    align-items: center;
    height: 48px;
    padding: 0 var(--spacing-16);
    border-radius: var(--border-radius-8);
    color: var(--color-text);

    @media (hover: hover) {
      &:hover {
        background-color: var(--color-hover);
      }
    }

    &:global(.link) {
      text-decoration: none;

      &:global(.active) {
        background-color: var(--color-active);
      }
    }

    &:global(.button) {
      text-align: left;
    }
  }

  .icon {
    font-size: 1.25em;
  }
</style>
