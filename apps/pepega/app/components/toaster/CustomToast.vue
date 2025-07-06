<template>
  <section :class="$style.component">
    <div :class="$style.header">
      <h3>
        {{ title }}
      </h3>

      <Icon
        name="tabler:x"
        @click="removeToast(toastId)"
      />
    </div>

    <div>
      {{ message }}
    </div>

    <div :class="$style.progress" />
  </section>
</template>

<script lang="ts" setup>
  import useToaster, { type Toast } from '~/composables/use-toaster';

  interface Props {
    readonly message: Toast['message'];
    readonly toastId: Toast['id'];
    readonly title: Toast['title'];
    readonly duration: Toast['duration'];
  }

  const { duration, toastId } = defineProps<Props>()
  const { removeToast } = useToaster()
  const timer = ref<number | undefined>()
  const progressDuration = computed(() => `${duration}ms`)

  function runTimer() {
    if (typeof duration === 'number') {
      timer.value = window.setTimeout(() => {
        removeToast(toastId)
      }, duration)
    }
  }

  function stopTimer() {
    clearTimeout(timer.value)
  }

  onMounted(() => {
    runTimer()
  })

  onBeforeUnmount(() => {
    stopTimer()
  })
</script>

<style module>
  .component {
    pointer-events: auto; /* Parent element has pointer-events: none */
    position: relative;
    max-width: 400px;
    display: grid;
    row-gap: var(--spacing-12);
    align-items: center;
    overflow: hidden;
    border: 1px solid var(--dialog-color-border);
    background-color: var(--dialog-color-background);
    border-radius: var(--border-radius-16);
    padding: var(--spacing-16);
    box-shadow: var(--shadow-1);

    /* For TransitionGroup animation */
    width: max-content;
    margin-left: auto;
    margin-bottom: var(--spacing-8);
  }

  .header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    column-gap: var(--spacing-16);
  }

  .progress {
    --size: 6px;

    position: absolute;
    bottom: 0;
    left: 0;
    height: var(--size);
    border-radius: var(--size);
    background-color: var(--color-green);
    width: 0;
    transition: width v-bind(progressDuration) linear;

    @starting-style {
      width: 100%;
    }
  }
</style>
