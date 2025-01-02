import * as v from 'valibot'
import { fail } from '@sveltejs/kit'

const codeSchema = v.pipe(v.string(), v.nonEmpty())

export async function load({ url }) {
  try {
    const code = url.searchParams.get('code')
    const validCode = v.parse(codeSchema, code)

    return {
      code: validCode
    }
  } catch (error) {
    console.error(error)

    fail(401, {
      message: 'Invalid code'
    })
  }
}
