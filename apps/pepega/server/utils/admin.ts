import { createError, type RequestEvent, type RequestEventContext } from 'nuxt/server'
import { parseISO, differenceInMilliseconds } from 'date-fns'
import { adminCheckInterval } from '~~/constants'
import { useAppSession } from '~~/server/utils/session'

interface CheckAdminOption {
  readonly force?: boolean;
}

function shouldCheckAdmin(lastCheck: string) {
  const lastCheckDate = parseISO(lastCheck)
  const now = new Date()
  const diff = differenceInMilliseconds(now, lastCheckDate)

  return diff > adminCheckInterval
}

async function isUserAdmin(db: RequestEventContext['db'], userId: string) {
  const result = await db.query.users
    .findFirst({
      columns: {
        id: true
      },

      where: {
        AND: [{ id: userId }, { isAdmin: true }]
      }
    })

  return result?.id !== undefined
}

/**
 * Check if the user is an admin.
 *
 * @param event The event object.
 * @param options The options object.
 * @param options.force Ignore the last check time and force a new check.
 * @returns Whether the user is an admin.
 * @example
 * ```ts
 * const isAdmin = await checkAdmin(event)
 * ```
 */
export async function checkAdmin(
  event: RequestEvent,
  { force = false } : CheckAdminOption = {}
) {
  const session = await useAppSession(event)
  const { userId, isAdmin = false, lastAdminCheck } = session.data

  if (typeof userId !== 'string') {
    return false
  }

  if (
    force ||
    lastAdminCheck === undefined ||
    shouldCheckAdmin(lastAdminCheck)
  ) {
    const userIsAdmin = await isUserAdmin(event.context.db, userId)

    await session.update({
      isAdmin: userIsAdmin,
      lastAdminCheck: new Date().toISOString()
    })

    return userIsAdmin
  }

  return isAdmin
}

export async function validateAdmin(
  event: RequestEvent,
  options: CheckAdminOption = {}
) {
  const isAdmin = await checkAdmin(event, options)

  if (isAdmin === false) {
    throw createError({
      status: 403,
      message: 'You do not have permission to perform this action'
    })
  }
}
