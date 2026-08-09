<template><DropdownMenuRoot><DropdownMenuTrigger as-child><UiIconButton icon="tabler:sun-moon" label="Choose theme" /></DropdownMenuTrigger><DropdownMenuPortal><DropdownMenuContent :class="$style.component" :side-offset="8" align="end"><DropdownMenuLabel :class="$style.label">Theme</DropdownMenuLabel><DropdownMenuRadioGroup v-model="theme"><DropdownMenuRadioItem v-for="option in options" :key="option.value" :class="$style.item" :value="option.value"><DropdownMenuItemIndicator><Icon name="tabler:check" aria-hidden="true" /></DropdownMenuItemIndicator><Icon :name="option.icon" aria-hidden="true" />{{ option.label }}</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenuPortal></DropdownMenuRoot></template>
<script setup lang="ts">
  import type { ThemePreference } from '~/types/ui'
  import { useTheme } from '~/composables/use-theme'
  import UiIconButton from './UiIconButton.vue'
  import { DropdownMenuContent, DropdownMenuItemIndicator, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'

  const { theme } = useTheme()
  const options: { icon: string; label: string; value: ThemePreference }[] = [{ icon: 'tabler:device-desktop', label: 'System', value: 'system' }, { icon: 'tabler:sun', label: 'Light', value: 'light' }, { icon: 'tabler:moon', label: 'Dark', value: 'dark' }]
</script>
<style module>
  .component { z-index: 70; min-inline-size: 10rem; padding: var(--space-xs); border: var(--outline); border-radius: var(--radius-control); background: var(--color-surface); box-shadow: var(--shadow-card); }
  .label { padding: var(--space-xs); color: var(--color-ink-muted); font: 700 var(--text-metadata)/1.4 var(--font-metadata); text-transform: uppercase; }
  .item { min-block-size: 2.5rem; display: grid; grid-template-columns: 1rem 1.25rem 1fr; align-items: center; gap: var(--space-xs); padding: 0 var(--space-xs); border-radius: var(--radius-cell); outline: none; &[data-highlighted] { background: var(--color-surface-muted); } }
</style>
