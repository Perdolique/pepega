import { createApp, toWebHandler } from 'h3'

const app = createApp()
const webHandler = toWebHandler(app)

app.use('/online', () => import('./online'), {
  lazy: true
})

/**
 * Bind resources to your worker in `wrangler.json`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    return webHandler(request, {
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
