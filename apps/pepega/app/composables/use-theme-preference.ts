import * as v from 'valibot'
import { useCookie, useState } from '#imports'

const themeSchema = v.picklist(['system', 'light', 'dark'])
type ThemePreference = v.InferOutput<typeof themeSchema>

// Shares the theme choice while a cookie restores it on server render.
export function useThemePreference() {
  const cookie = useCookie<unknown>('pepega-theme', {
    default: () => 'system',
    maxAge: 31_536_000,
    path: '/',
    sameSite: 'lax'
  })

  const preference = useState<ThemePreference>('pepega-theme-preference', () => {
    const result = v.safeParse(themeSchema, cookie.value)
    const initialPreference = result.success ? result.output : 'system'

    return initialPreference
  })

  function setPreference(value: unknown) {
    const result = v.safeParse(themeSchema, value)

    if (result.success) {
      preference.value = result.output
      cookie.value = result.output
    }
  }

  return { preference, setPreference }
}
