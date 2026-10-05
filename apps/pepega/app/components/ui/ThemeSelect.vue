<template>
  <label :class="$style.component">
    <span :class="$style.label">Theme:</span>

    <select
      :class="$style.select"
      :value="preference"
      aria-label="Theme"
      @change="handleChange"
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>

    <Icon
      :class="$style.icon"
      name="tabler:chevron-down"
      aria-hidden="true"
    />
  </label>
</template>

<script setup lang="ts">
  import { useThemePreference } from '~/composables/use-theme-preference'

  const { preference, setPreference } = useThemePreference()

  function handleChange(event: Event) {
    const select = event.currentTarget as HTMLSelectElement

    setPreference(select.value)
  }
</script>

<style module>
  .component {
    position: relative;
    display: inline-flex;
    align-items: center;
    border: var(--ui-outline);
    border-radius: var(--ui-radius-control);
    background-color: var(--ui-color-surface);
    font-size: var(--ui-font-size-small);
    font-weight: 700;
    line-height: 1.4;

    &:has(:focus-visible) {
      outline: var(--ui-focus-outline);
      outline-offset: 3px;
    }
  }

  .label {
    padding-inline-start: var(--ui-spacing-md);
    pointer-events: none;
  }

  .select {
    appearance: none;
    min-block-size: var(--ui-control-min);
    padding-block: var(--ui-spacing-sm);
    padding-inline: var(--ui-spacing-sm) calc(1rem + var(--ui-spacing-xl));
    border: none;
    border-radius: inherit;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:focus-visible {
      outline: none;
    }
  }

  .icon {
    position: absolute;
    inset-inline-end: var(--ui-spacing-md);
    font-size: 1rem;
    pointer-events: none;
  }

  @media (forced-colors: active) {
    .select {
      appearance: auto;
      padding-inline-end: var(--ui-spacing-md);
    }

    .icon {
      display: none;
    }
  }
</style>
