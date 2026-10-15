import { isSamePath } from 'ufo'
import { publicApiPaths } from '~~/constants'
import { getAppSession } from '~~/server/utils/session'
import { createError, defineEventHandler, getRequestURL } from 'nuxt/server'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const isApiPath = url.pathname.startsWith('/api')

  if (isApiPath) {
    const isPublic = publicApiPaths.some((path) => {
      return isSamePath(path, url.pathname)
    })

    if (isPublic) {
      return
    }

    const session = await getAppSession(event)
    const { userId } = session.data

    if (typeof userId !== 'string') {
      throw createError({
        status: 401
      })
    }

    event.context.userId = userId
  }
})
