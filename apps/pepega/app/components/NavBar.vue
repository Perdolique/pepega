<template>
  <div :class="$style.component">
    <AppMenu :class="$style.menu" />

    <NuxtLink
      :class="$style.link"
      to="/"
    >
      <img
        :class="$style.image"
        src="/pepega.webp"
      />

      <span>
        Pepega
      </span>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
  import AppMenu from './AppMenu.vue';
</script>

<style module>
  .component {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    place-items: center;
    padding: var(--spacing-12) var(--spacing-24);
    border-bottom: 1px solid var(--color-border);
    box-shadow: 0 2px 4px oklch(0 0 0 / 0.1);
  }

  .menu {
    justify-self: start;
  }

  .link {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    font-size: var(--font-size-24);
    font-weight: 300;
    color: var(--color-text);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .image {
    width: 36px;
    height: 36px;
  }
</style>
