<template>
  <header :class="$style.component">
    <div :class="$style.canvas">
      <AppBrand />

      <nav
        :class="$style.desktopNavigation"
        aria-label="Product navigation"
      >
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :class="$style.navigationLink"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <DropdownMenuRoot>
        <DropdownMenuTrigger
          as-child
          :class="$style.desktopMenu"
        >
          <UiButton variant="ghost">
            {{ identity }}
            <Icon
              name="tabler:chevron-down"
              aria-hidden="true"
            />
          </UiButton>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            :class="$style.menu"
            :side-offset="8"
            align="end"
          >
            <DropdownMenuLabel :class="$style.menuLabel">
              {{ role }}
            </DropdownMenuLabel>

            <DropdownMenuItem
              v-if="userStore.isAdmin"
              :class="$style.menuItem"
              as-child
            >
              <NuxtLink to="/admin">
                <Icon
                  name="tabler:shield"
                  aria-hidden="true"
                />
                Admin
              </NuxtLink>
            </DropdownMenuItem>

            <DropdownMenuSeparator :class="$style.menuSeparator" />
            <DropdownMenuLabel :class="$style.menuLabel">
              Theme
            </DropdownMenuLabel>

            <DropdownMenuRadioGroup v-model="theme">
              <DropdownMenuRadioItem
                v-for="option in themeOptions"
                :key="option.value"
                :class="$style.menuItem"
                :value="option.value"
              >
                <DropdownMenuItemIndicator>
                  <Icon
                    name="tabler:check"
                    aria-hidden="true"
                  />
                </DropdownMenuItemIndicator>
                {{ option.label }}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator :class="$style.menuSeparator" />

            <DropdownMenuItem
              :class="$style.menuItem"
              @select="logout"
            >
              <Icon
                name="tabler:logout"
                aria-hidden="true"
              />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      <UiIconButton
        :class="$style.mobileMenuButton"
        icon="tabler:menu-2"
        label="Open navigation"
        @click="isMobileMenuOpen = true"
      />
    </div>

    <UiDialog
      v-model="isMobileMenuOpen"
      title="Navigation"
    >
      <nav
        :class="$style.mobileNavigation"
        aria-label="Product navigation"
      >
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :class="$style.mobileNavigationLink"
          :to="item.to"
          @click="isMobileMenuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>

        <NuxtLink
          v-if="userStore.isAdmin"
          :class="$style.mobileNavigationLink"
          to="/admin"
          @click="isMobileMenuOpen = false"
        >
          Admin
        </NuxtLink>
      </nav>

      <div :class="$style.mobilePreferences">
        <strong>{{ identity }}</strong>
        <span>{{ role }}</span>

        <label :class="$style.themeField">
          Theme
          <select v-model="theme">
            <option
              v-for="option in themeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>

        <UiButton
          variant="ghost"
          @click="logout"
        >
          Log out
        </UiButton>
      </div>
    </UiDialog>
  </header>
</template>

<script setup lang="ts">
  import type { ThemePreference } from '~/types/ui'
  import AppBrand from './AppBrand.vue'
  import UiButton from './ui/UiButton.vue'
  import UiDialog from './ui/UiDialog.vue'
  import UiIconButton from './ui/UiIconButton.vue'
  import { useTheme } from '~/composables/use-theme'
  import { useUserStore } from '~/stores/user'
  import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuItemIndicator,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuRoot,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from 'reka-ui'
  import { computed, ref } from 'vue'
  import { navigateTo } from '#imports'

  interface NavigationItem {
    label: string;
    to: string;
  }

  interface ThemeOption {
    label: string;
    value: ThemePreference;
  }

  const navigationItems: NavigationItem[] = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Notifications', to: '/notifications' },
    { label: 'Account', to: '/account' }
  ]
  const themeOptions: ThemeOption[] = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]

  const userStore = useUserStore()
  const { theme } = useTheme()
  const isMobileMenuOpen = ref(false)
  const identity = computed(
    () => userStore.displayName ?? userStore.login ?? 'Pepega user'
  )
  const role = computed(() => {
    if (userStore.isAdmin) {
      return 'Admin'
    }

    return userStore.isStreamer ? 'Streamer' : 'Viewer'
  })

  async function logout() {
    await userStore.logout()
    await navigateTo('/')
  }
</script>

<style module>
  .component {
    position: sticky;
    z-index: 20;
    top: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 16%, transparent);
    background: var(--color-paper);
  }

  .canvas {
    inline-size: min(100% - 2rem, 90rem);
    min-block-size: 4rem;
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    margin-inline: auto;
  }

  .desktopNavigation,
  .desktopMenu {
    display: none;
  }

  .navigationLink,
  .mobileNavigationLink {
    color: var(--color-ink-secondary);
    font-weight: 700;
    text-decoration: none;
  }

  .navigationLink:global(.router-link-active),
  .mobileNavigationLink:global(.router-link-active) {
    color: var(--color-ink);
    text-decoration: underline;
    text-decoration-color: var(--color-primary);
    text-decoration-thickness: 0.1875rem;
    text-underline-offset: 0.35rem;
  }

  .mobileMenuButton {
    margin-inline-start: auto;
  }

  .menu {
    z-index: 70;
    min-inline-size: 12rem;
    padding: var(--space-xs);
    border: 1px solid color-mix(in srgb, var(--color-ink) 28%, transparent);
    border-radius: var(--radius-control);
    background: var(--color-surface);
  }

  .menuLabel {
    padding: var(--space-xs) var(--space-sm);
    color: var(--color-ink-muted);
    font-size: var(--text-body-sm);
    font-weight: 700;
  }

  .menuItem {
    min-block-size: 2.5rem;
    display: grid;
    grid-template-columns: 1.25rem 1fr;
    align-items: center;
    gap: var(--space-xs);
    padding-inline: var(--space-sm);
    border-radius: var(--radius-cell);
    outline: none;
    text-decoration: none;
  }

  .menuItem[data-highlighted] {
    background: var(--color-surface-muted);
  }

  .menuSeparator {
    block-size: 1px;
    margin-block: var(--space-xs);
    background: color-mix(in srgb, var(--color-ink) 16%, transparent);
  }

  .mobileNavigation {
    display: grid;
  }

  .mobileNavigationLink {
    padding-block: var(--space-sm);
    border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent);
  }

  .mobilePreferences {
    display: grid;
    gap: var(--space-sm);
  }

  .mobilePreferences > span {
    color: var(--color-ink-muted);
    font-size: var(--text-body-sm);
  }

  .themeField {
    display: grid;
    gap: var(--space-xs);
    font-weight: 700;
  }

  .themeField select {
    min-block-size: var(--control-size);
    padding-inline: var(--space-sm);
    border: 1px solid color-mix(in srgb, var(--color-ink) 36%, transparent);
    border-radius: var(--radius-control);
    background: var(--color-surface);
    color: var(--color-ink);
  }

  @media (min-width: 48rem) {
    .canvas {
      inline-size: min(100% - 3rem, 90rem);
    }

    .desktopNavigation {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      margin-inline-start: var(--space-lg);
    }

    .desktopMenu {
      display: inline-flex;
      margin-inline-start: auto;
    }

    .mobileMenuButton {
      display: none;
    }
  }
</style>
