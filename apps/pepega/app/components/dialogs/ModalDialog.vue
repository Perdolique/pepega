<template>
  <DialogRoot v-model:open="open">
    <AnimatePresence>
      <DialogOverlay
        :class="$style.overlay"
        as-child
        ref="overlayRef"
      >
        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1, transition: animateTransition }"
          :exit="{ opacity: 0, transition: exitTransition }"
        />
      </DialogOverlay>

      <DialogContent
        :class="$style.content"
        :aria-describedby="undefined"
        as-child
        @pointer-down-outside="onPointerDownOutside"
      >
        <Motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1, transition: animateTransition }"
          :exit="{ opacity: 0, scale: 0.95, transition: exitTransition }"
        >
          <DialogTitle>
            {{ title }}
          </DialogTitle>

          <slot />
        </Motion>
      </DialogContent>
    </AnimatePresence>
  </DialogRoot>
</template>

<script lang="ts" setup>
  import { Motion, AnimatePresence } from 'motion-v'
  import { DialogOverlay, DialogContent, DialogRoot, DialogTitle } from 'reka-ui'

  type PointerDownOutsideEvent = CustomEvent<{
    originalEvent: PointerEvent;
  }>

  interface Props {
    title: string
  }

  defineProps<Props>()

  const overlayRef = useTemplateRef('overlayRef')

  const animateTransition = {
    ease: [0.25, 0.1, 0.25, 1.0],
    duration: 0.2
  } as const

  const exitTransition = {
    ease: [0.4, 0, 0.2, 1],
    duration: 0.15
  } as const

  const open = defineModel<boolean>({
    required: true
  })

  /*
   * We should handle clicks outside only on the overlay element.
   * It helps to prevent closing the dialog when clicking on the other elements over the overlay.
   * Ex.: toast notifications, tooltips, etc.
   */
  function onPointerDownOutside(event: PointerDownOutsideEvent) {
    if (event.target !== overlayRef.value?.$el) {
      event.preventDefault()
    }
  }
</script>

<style module>
  .overlay {
    position: fixed;
    inset: 0;
    background-color: var(--overlay-color-background);
    backdrop-filter: var(--overlay-backdrop-filter);
  }

  .content {
    position: fixed;
    top: 50%;
    left: 50%;
    max-width: 90vw;
    max-height: 85vh;
    width: max-content;
    min-width: var(--dialog-min-width);
    display: grid;
    row-gap: var(--spacing-16);
    background-color: var(--dialog-color-background);
    border-radius: var(--dialog-border-radius);
    padding: var(--dialog-padding);
    border: 1px solid var(--dialog-color-border);
    translate: -50% -50%;
    will-change: transform;
  }
</style>
