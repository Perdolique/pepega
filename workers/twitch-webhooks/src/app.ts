import { H3, defineLazyEventHandler } from 'h3'

const app = new H3()
const onlineHandler = defineLazyEventHandler(async () => {
  const { default: handler } = await import('./online')

  return handler
})

app.use('/online/**', onlineHandler)

/**
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `vp run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    return app.request(request, undefined, {
      cloudflare: {
        env,
        ctx
      }
    })
  }
} satisfies ExportedHandler<Env>

declare module 'h3' {
  interface H3EventContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
    }
  }
}
