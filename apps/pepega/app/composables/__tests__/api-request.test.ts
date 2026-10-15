import { describe, expectTypeOf, it } from 'vitest'
import type { RequestBodyOf, RequestQueryOf } from '#shared/types/api-request'
import type createNotification from '~~/server/api/notifications/index.post'
import type listDestinations from '~~/server/api/notifications/destinations.get'

// Nuxt typecheck checks these assertions; Vitest also verifies the test module loads.
describe('portable API request types', () => {
  it('keeps the validated notification body on its handler', () => {
    expectTypeOf<RequestBodyOf<typeof createNotification>>()
      .toEqualTypeOf<{ eventType: 'stream.online' }>()
  })

  it('keeps the query input before its numeric transform', () => {
    expectTypeOf<RequestQueryOf<typeof listDestinations>>()
      .toEqualTypeOf<{ notificationId: string }>()
  })
})
