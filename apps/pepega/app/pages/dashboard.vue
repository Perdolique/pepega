<template>
  <PageBase title="Dashboard">
    <div :class="$style.content">
      <Icon name="streamline-emojis:dog" />
      <Icon name="streamline-emojis:dashing-away" />
    </div>
  </PageBase>
</template>

<script setup lang="ts">
  import PageBase from '~/components/PageBase.vue';
</script>

<style module>
  .content {
    text-align: center;
    font-size: 64px;
  }
</style>

