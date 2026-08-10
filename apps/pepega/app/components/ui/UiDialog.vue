<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="$style.overlay" />
      <DialogContent :class="$style.component">
        <header :class="$style.header">
          <div>
            <DialogTitle :class="$style.title">
              {{ title }}
            </DialogTitle>
            <DialogDescription
              v-if="description"
              :class="$style.description"
            >
              {{ description }}
            </DialogDescription>
            <DialogDescription
              v-else
              :class="$style.visuallyHidden"
            >
              Navigation and controls for {{ title }}.
            </DialogDescription>
          </div>

          <DialogClose as-child>
            <UiIconButton
              icon="tabler:x"
              label="Close dialog"
            />
          </DialogClose>
        </header>

        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
  import UiIconButton from './UiIconButton.vue'
  import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle
  } from 'reka-ui'

  interface Props {
    description?: string;
    title: string;
  }

  defineProps<Props>()

  const open = defineModel<boolean>({ required: true })
</script>

<style module>
  .overlay {
    position: fixed;
    z-index: 50;
    inset: 0;
    background: rgb(38 32 26 / 70%);
  }

  .component {
    position: fixed;
    z-index: 51;
    inset: 50% auto auto 50%;
    translate: -50% -50%;
    inline-size: min(34rem, calc(100vw - 2rem));
    max-block-size: calc(100vh - 2rem);
    overflow: auto;
    display: grid;
    gap: var(--space-lg);
    padding: var(--space-lg);
    border: 2px solid var(--color-ink);
    border-radius: var(--radius-card);
    background: var(--color-surface);
    color: var(--color-ink);
  }

  .header {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
  }

  .title {
    font: 800 1.375rem/1.15 var(--font-display);
  }

  .description {
    margin-top: var(--space-xs);
    color: var(--color-ink-secondary);
  }

  .visuallyHidden {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
