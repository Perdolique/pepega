import * as v from 'valibot'

export const webhookIdSchema = v.pipe(
  v.string(),
  v.transform(Number),
  v.number(),
  v.integer(),
  v.minValue(1)
)
