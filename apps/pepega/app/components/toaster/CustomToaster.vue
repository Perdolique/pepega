<template>
  <TransitionGroup
    name="toaster"
    tag="div"
    :class="$style.component"
  >
    <CustomToast
      v-for="{ id, message, duration, title } in toasts"
      :key="id"
      :message="message"
      :title="title"
      :toast-id="id"
      :duration="duration"
    />
  </TransitionGroup>
</template>

<script lang="ts" setup>
  import useToaster from '~/composables/use-toaster'
  import CustomToast from './CustomToast.vue'

  const { toasts } = useToaster()
</script>

<style>
  .toaster-move {
    transition: transform var(--transition-normal);
  }

  .toaster-enter-active,
  .toaster-leave-active {
    transition:
      transform var(--transition-normal),
      opacity var(--transition-normal);
  }

  .toaster-enter-from,
  .toaster-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  .toaster-leave-active {
    position: absolute;
    right: 0;
  }
</style>

<style module>
  .component {
    position: fixed;
    pointer-events: none;
    top: 0;
    right: 0;
    padding: var(--spacing-24);
  }
</style>
