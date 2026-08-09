<template>
  <PageBase title="Account">
    <div :class="$style.cardsContainer">
      <AccountTypeCard />
      <TelegramChannelsCard />
    </div>
  </PageBase>
</template>

<script setup lang="ts">
  import PageBase from '~/components/PageBase.vue';
  import AccountTypeCard from '~/components/pages/account/AccountTypeCard.vue'
  import TelegramChannelsCard from '~/components/pages/account/TelegramChannelsCard.vue'
</script>

<style module>
  .cardsContainer {
    display: grid;
    row-gap: var(--spacing-16);
  }
</style>
