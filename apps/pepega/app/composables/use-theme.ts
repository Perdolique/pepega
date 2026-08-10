import type { ThemePreference } from '~/types/ui'
import { computed } from 'vue'
import { useCookie } from '#imports'

const themeValues = new Set<ThemePreference>(['system', 'light', 'dark'])

export function useTheme() {
  const cookie = useCookie<ThemePreference>('pepega-theme', {
    default: () => 'system',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
  const theme = computed<ThemePreference>({
    get: () => themeValues.has(cookie.value) ? cookie.value : 'system',
    set: (value) => { cookie.value = value }
  })

  return { theme }
}
