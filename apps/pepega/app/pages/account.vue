<template>
  <div :class="$style.component">
    <UiPageHeader title="Account" />

    <section
      :class="$style.section"
      aria-labelledby="twitch-account-title"
    >
      <div>
        <h2 id="twitch-account-title">
          Twitch account
        </h2>
        <p>{{ identityCopy }}</p>
      </div>
      <Icon
        name="tabler:brand-twitch"
        aria-hidden="true"
      />
    </section>

    <AccountTypeCard />
    <TelegramChannelsCard />
  </div>
</template>

<script setup lang="ts">
  import AccountTypeCard from '~/components/pages/account/AccountTypeCard.vue'
  import TelegramChannelsCard from '~/components/pages/account/TelegramChannelsCard.vue'
  import UiPageHeader from '~/components/ui/UiPageHeader.vue'
  import { useUserStore } from '~/stores/user'
  import { computed } from 'vue'
  import { useHead } from '#imports'

  const userStore = useUserStore()
  const identityCopy = computed(() => {
    if (userStore.login === null) {
      return 'No Twitch identity is connected.'
    }

    const displayName = userStore.displayName ?? userStore.login

    return `${displayName} (@${userStore.login})`
  })

  useHead({ title: 'Account — Pepega' })
</script>

<style module>
  .component {
    max-inline-size: 52rem;
    display: grid;
    gap: 0;
  }

  .component > * + * {
    margin-block-start: var(--space-xl);
    padding-block-start: var(--space-xl);
    border-block-start: 1px solid color-mix(in srgb, var(--color-ink) 16%, transparent);
  }

  .section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
  }

  .section h2 {
    font-size: 1.25rem;
  }

  .section p {
    color: var(--color-ink-secondary);
  }

  .section > svg {
    flex: none;
    color: var(--color-twitch);
    font-size: 2rem;
  }
</style>
