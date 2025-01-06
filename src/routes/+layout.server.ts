import type { LayoutServerLoad } from './$types'

export const load : LayoutServerLoad = function (event) {
  const { userId } = event.locals
  const isAuthenticated = userId !== undefined

  return {
    isAuthenticated,
    userId
  }
}
