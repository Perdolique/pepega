<template><div :class="$style.component"><AppBrand /><nav :class="$style.nav" aria-label="Product navigation"><NuxtLink v-for="item in mainItems" :key="item.to" :class="$style.link" :to="item.to" @click="$emit('navigate')"><Icon :name="item.icon" aria-hidden="true" />{{ item.label }}</NuxtLink><div :class="$style.divider" /><NuxtLink :class="$style.link" to="/account" @click="$emit('navigate')"><Icon name="tabler:user" aria-hidden="true" />Account</NuxtLink><NuxtLink v-if="userStore.isAdmin" :class="$style.link" to="/admin" @click="$emit('navigate')"><Icon name="tabler:shield" aria-hidden="true" />Admin</NuxtLink></nav><footer :class="$style.footer"><div :class="$style.identity"><strong>{{ identity }}</strong><span>{{ role }}</span></div><div :class="$style.footerActions"><UiThemeMenu /><UiIconButton icon="tabler:logout" label="Log out" @click="logout" /></div></footer></div></template>
<script setup lang="ts">
  import AppBrand from './AppBrand.vue'
  import UiIconButton from './ui/UiIconButton.vue'
  import UiThemeMenu from './ui/UiThemeMenu.vue'
  import { useUserStore } from '~/stores/user'
  import { computed } from 'vue'
  import { navigateTo } from '#imports'

  defineEmits<{ navigate: [] }>()
  const userStore = useUserStore()
  const mainItems = [{ icon: 'tabler:layout-dashboard', label: 'Dashboard', to: '/dashboard' }, { icon: 'tabler:bell', label: 'Notifications', to: '/notifications' }]
  const identity = computed(() => userStore.displayName ?? userStore.login ?? 'Pepega user')
  const role = computed(() => {
    if (userStore.isAdmin) {
      return 'Admin'
    }

    return userStore.isStreamer ? 'Streamer' : 'Viewer'
  })
  async function logout() { await userStore.logout(); await navigateTo('/') }
</script>
<style module>
  .component { min-block-size: 100%; display: flex; flex-direction: column; gap: var(--space-xl); padding: var(--space-lg); }
  .nav { display: grid; gap: var(--space-xs); }
  .link { position: relative; min-block-size: var(--control-size); display: flex; align-items: center; gap: var(--space-sm); padding: 0 var(--space-md); border-radius: var(--radius-control); color: var(--color-ink-secondary); font-weight: 700; text-decoration: none; &:global(.router-link-active) { background: var(--color-surface); color: var(--color-ink); &::before { content: ""; position: absolute; inset: 0 auto 0 0; inline-size: 0.25rem; border-radius: var(--radius-full); background: var(--color-primary); } } }
  .divider { block-size: 2px; margin-block: var(--space-sm); background: var(--color-ink); opacity: 0.15; }
  .footer { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); flex-wrap: wrap; }
  .identity { display: grid; min-inline-size: 0; & strong { overflow: hidden; text-overflow: ellipsis; } & span { color: var(--color-ink-muted); font: 500 var(--text-metadata)/1.4 var(--font-metadata); } }
  .footerActions { display: flex; gap: var(--space-xs); }
</style>
