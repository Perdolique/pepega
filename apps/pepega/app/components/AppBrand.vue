<template><NuxtLink :class="$style.component" to="/"><img :class="$style.mascot" src="/pepega.webp" alt="" /><span>Pepega</span></NuxtLink></template>
<style module>
  .component { display: inline-flex; align-items: center; gap: var(--space-xs); color: var(--color-ink); font: 800 1.375rem/1 var(--font-display); text-decoration: none; }
  .mascot { inline-size: 2.5rem; block-size: 2.5rem; object-fit: contain; }
</style>
