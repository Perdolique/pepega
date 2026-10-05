<template>
  <div />
</template>

<script setup lang="ts">
  import { definePageMeta } from '#imports'

  // The global auth middleware redirects this legacy entry before rendering.
  definePageMeta({ layout: false })
</script>
