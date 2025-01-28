import { isSamePath } from 'ufo'
import { publicApiPaths } from '~~/constants'

declare module 'h3' {
  interface H3EventContext {
    userId: string
  }
}

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

    if (userId === undefined) {
      throw createError({
        statusCode: 401
      })
    }

    event.context.userId = userId
  }
})
