<template>
  <div :class="$style.page">
    <h2>Account page</h2>

    <div :class="$style.cardsContainer">
      <AccountTypeCard
        :isPending="isPending"
        :isStreamer="userStore.isStreamer"
        @toggle="onAccountToggle"
      />

      <BaseCard :class="$style.card">
        <h3>
          Telegram channels
        </h3>

        <SimpleButton
          @click="onClick"
        >
          TEST
        </SimpleButton>

        <InputDialog
          header-text="Add Telegram channel"
          placeholder="@perdTV"
          add-button-text="Add channel"
          :maxlength="32"
          v-model="isOpened"
        />
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BaseCard from '~/components/BaseCard.vue'
  import { useUserStore } from '~/stores/user'
  import AccountTypeCard from '~/components/pages/account/AccountTypeCard.vue'
  import SimpleButton from '~/components/SimpleButton.vue'
  import InputDialog from '~/components/dialogs/InputDialog.vue'

  const isPending = ref(false)
  const isOpened = ref(false)
  const userStore = useUserStore()

  async function onAccountToggle() {
    isPending.value = true

    if (userStore.isStreamer) {
      await userStore.setStreamer(false)
    } else {
      await userStore.setStreamer(true)
    }

    isPending.value = false
  }

  function onClick() {
    isOpened.value = true
  }
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

  .card {
    display: grid;
    row-gap: var(--spacing-16);
    justify-content: start;
  }
</style>
