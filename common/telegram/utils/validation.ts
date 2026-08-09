import * as v from 'valibot'

const botTokenSchema = v.pipe(v.string(), v.nonEmpty())

// TODO: Add more validation rules
export function validateBotToken(token: unknown) {
  return v.safeParse(botTokenSchema, token)
}
