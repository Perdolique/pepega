<template>
  <div :class="$style.component">
    <label
      :class="$style.label"
      :for="forId"
    >
      {{ label }}
    </label>
    <slot />

    <div
      v-if="helper || counter"
      :class="$style.meta"
    >
      <span>{{ helper }}</span>
      <span>{{ counter }}</span>
    </div>
    <p
      v-if="error"
      :class="$style.error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    counter?: string;
    error?: string;
    forId: string;
    helper?: string;
    label: string;
  }

  defineProps<Props>()
</script>

<style module>
  .component {
    display: grid;
    gap: var(--space-xs);
  }

  .label {
    font-weight: 700;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    color: var(--color-ink-muted);
    font-size: var(--text-body-sm);
  }

  .error {
    color: var(--color-danger);
    font-size: var(--text-body-sm);
    font-weight: 700;
  }
</style>
