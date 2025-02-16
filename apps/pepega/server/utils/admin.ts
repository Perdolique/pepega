import type { H3Event, EventHandlerRequest, H3EventContext } from 'h3'
import { parseISO, differenceInMilliseconds } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { adminCheckInterval } from '~~/constants'

interface CheckAdminOption {
  readonly force?: boolean;
}

function shouldCheckAdmin(lastCheck: string) {
  const lastCheckDate = parseISO(lastCheck)
  const now = new Date()
  const diff = differenceInMilliseconds(now, lastCheckDate)

  return diff > adminCheckInterval
}

async function isUserAdmin(db: H3EventContext['db'], userId: string) {
  const result = await db.query.users
    .findFirst({
      columns: {
        id: true
      },

      where: and(
        eq(tables.users.id, userId),
        eq(tables.users.isAdmin, true)
      )
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
async function checkAdmin(
  event: H3Event<EventHandlerRequest>,
  { force = false } : CheckAdminOption = {}
) {
  const session = await useAppSession(event)
  const { userId, isAdmin = false, lastAdminCheck } = session.data

  if (userId === undefined) {
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
  event: H3Event<EventHandlerRequest>,
  options: CheckAdminOption = {}
) {
  const isAdmin = await checkAdmin(event, options)

  if (isAdmin === false) {
    throw createError({
      statusCode: 403,
      message: 'You do not have permission to perform this action'
    })
  }
}
