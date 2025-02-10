<template>
  <div :class="$style.component">
    <button
      ref="buttonRef"
      :class="$style.button"
      @click="toggleMenu"
    >
      <Icon name="tabler:menu-2" />
    </button>

    <div :class="[$style.menu, { visible: isMenuVisible }]">
      <AppMenuItem
        icon="tabler:home"
        to="/"
      >
        Home
      </AppMenuItem>

      <AppMenuItem
        v-if="userStore.isAuthenticated"
        icon="tabler:grid"
        to="/dashboard"
      >
        Dashboard
      </AppMenuItem>

      <AppMenuItem
        v-if="!userStore.isAuthenticated"
        icon="tabler:login"
        to="/login"
      >
        Login
      </AppMenuItem>

      <AppMenuItem
        v-if="userStore.isAuthenticated"
        icon="tabler:logout"
        @click="logout"
      >
        Logout
      </AppMenuItem>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useClickOutside } from '~/composables/use-click-outside';
  import { useUserStore } from '~/stores/user';
  import AppMenuItem from './AppMenuItem.vue';

  const userStore = useUserStore();
  const isMenuVisible = ref(false);
  const buttonRef = useTemplateRef('buttonRef');

  function toggleMenu() {
    isMenuVisible.value = !isMenuVisible.value;
  }

  function hideMenu() {
    isMenuVisible.value = false;
  }

  async function logout() {
    try {
      await userStore.logout()

      await navigateTo('/login', {
        replace: true
      })
    } catch {
      // TODO: Handle error
    }
  }

  useClickOutside(isMenuVisible, hideMenu, {
    ignore: [buttonRef]
  })
</script>

<style module>
  .component {
    height: 48px;
    width: 48px;
    position: relative;
  }

  .button {
    width: 100%;
    height: 100%;
    font-size: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--color-hover);
    }
  }

  .menu {
    display: none;
    position: absolute;
    top: 100%;
    margin-top: var(--spacing-8);
    left: 0;
    opacity: 0;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 4px oklch(0 0 0 / 0.1);
    border-radius: var(--border-radius-12);
    padding: var(--spacing-8);
    row-gap: var(--spacing-4);
    transition:
      opacity var(--transition-fast) var(--easing-fast-out-slow-in),
      display var(--transition-fast) var(--easing-fast-out-slow-in) allow-discrete;

    &:global(.visible) {
      display: grid;
      opacity: 1;

      @starting-style {
        opacity: 0;
      }
    }
  }
</style>
