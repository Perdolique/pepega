<template><div :class="$style.component"><UiPageHeader title="Account" :description="identityCopy" /><div :class="$style.cards"><AccountTypeCard /><TelegramChannelsCard /></div></div></template>
<script setup lang="ts">
  import AccountTypeCard from '~/components/pages/account/AccountTypeCard.vue'; import TelegramChannelsCard from '~/components/pages/account/TelegramChannelsCard.vue'; import UiPageHeader from '~/components/ui/UiPageHeader.vue'; import { useUserStore } from '~/stores/user'; import { computed } from 'vue'; import { useHead } from '#imports'

  const userStore = useUserStore(); const identityCopy = computed(() => userStore.login === null ? 'Manage your role and notification destinations.' : `Connected as ${userStore.displayName ?? userStore.login} (@${userStore.login}).`); useHead({ title: 'Account — Pepega' })
</script>
<style module>.component { display: grid; gap: var(--space-xl); } .cards { display: grid; align-items: start; gap: var(--space-lg); } @media (min-width: 64rem) { .cards { grid-template-columns: minmax(18rem, 0.7fr) minmax(0, 1.3fr); } }</style>
