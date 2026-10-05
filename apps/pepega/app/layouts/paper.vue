<template>
  <div
    :class="$style.component"
    data-design-system="paper"
  >
    <a
      :class="$style.skipLink"
      :href="mainAnchor"
    >Skip to content</a>

    <header :class="$style.header">
      <span :class="$style.brand">Pepega</span>
      <ThemeSelect />
    </header>

    <main
      :id="mainId"
      :class="$style.main"
      tabindex="-1"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import ThemeSelect from '~/components/ui/ThemeSelect.vue'
  import { useId } from 'vue'

  const mainId = useId()
  const mainAnchor = `#${mainId}`
</script>

<style>
  @import '~/assets/styles/design-system.css';
</style>

<style module>
  .component {
    position: relative;
    display: flex;
    flex-direction: column;
    min-block-size: 100svh;
    background-color: var(--ui-color-page);
    color: var(--ui-color-text);
    font-family: var(--ui-font-body);
    font-size: var(--ui-font-size-body);
    line-height: 1.55;

    &::before {
      position: absolute;
      inset: 0 0 auto;
      block-size: 18rem;
      background-image: radial-gradient(var(--ui-color-text) 1px, transparent 1px);
      background-size: 18px 18px;
      opacity: 0.08;
      pointer-events: none;
      content: '';
    }
  }

  .header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ui-spacing-lg);
    inline-size: 100%;
    max-inline-size: var(--ui-page-max);
    margin-inline: auto;
    padding: var(--ui-spacing-xl);
  }

  .brand {
    font-family: var(--ui-font-display);
    font-size: var(--ui-font-size-title);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  .main {
    position: relative;
    flex: 1;
    display: grid;
    place-items: center;
    inline-size: 100%;
    max-inline-size: var(--ui-page-max);
    margin-inline: auto;
    padding: var(--ui-spacing-2xl) var(--ui-spacing-xl) var(--ui-spacing-4xl);

    &:focus-visible {
      outline: var(--ui-focus-outline);
      outline-offset: -3px;
    }
  }

  .skipLink {
    position: absolute;
    z-index: 1;
    inset-block-start: var(--ui-spacing-sm);
    inset-inline-start: var(--ui-spacing-lg);
    padding: var(--ui-spacing-sm) var(--ui-spacing-lg);
    border: var(--ui-outline);
    border-radius: var(--ui-radius-control);
    background-color: var(--ui-color-surface);
    transform: translateY(calc(-100% - var(--ui-spacing-lg)));

    &:focus-visible {
      outline: var(--ui-focus-outline);
      outline-offset: 3px;
      transform: none;
    }
  }

  @media (width < 640px) {
    .header {
      flex-wrap: wrap;
      padding: var(--ui-spacing-xl) var(--ui-spacing-lg);
    }

    .main {
      padding: var(--ui-spacing-xl) var(--ui-spacing-lg) var(--ui-spacing-3xl);
    }
  }

  @media (forced-colors: active) {
    .component::before {
      display: none;
    }
  }
</style>
