<template>
  <div :class="$style.page">
    <h2>Account page</h2>

    <div :class="$style.cardsContainer">
      <AccountTypeCard />
      <TelegramChannelsCard />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AccountTypeCard from '~/components/pages/account/AccountTypeCard.vue'
  import TelegramChannelsCard from '~/components/pages/account/TelegramChannelsCard.vue'
</script>

<style module>
  .page {
    display: grid;
    row-gap: var(--spacing-32);
  }

  .cardsContainer {
    display: grid;
    row-gap: var(--spacing-16);
  }
</style>
