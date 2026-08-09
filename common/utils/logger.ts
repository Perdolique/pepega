import { createConsola } from 'consola/browser'

// TODO: improve logger for Cloudflare Workers https://developers.cloudflare.com/workers/observability/logs/workers-logs/#best-practices
export function createLogger(tag: string) {
  return createConsola({
    defaults: {
      tag
    }
  })
}
