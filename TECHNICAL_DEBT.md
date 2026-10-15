# Technical debt

## TypeScript 7 and Vue tooling

Keep the TypeScript catalog at 6.0.3. TypeScript 7 uses a native compiler and does not provide the JavaScript compiler API that Vue tooling needs. The installed `vue-tsc` 3.3.13 still loads `typescript/lib/tsc` through Volar.

Update after Vue's compiler tooling supports TypeScript 7. Run all type checks, including Vue templates. See the [TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#typescript-and-embedded-languages).

## Nuxt DevTools 4 opt-in

Nuxt 4.6 bundles DevTools 3. The explicit `@nuxt/devtools` dependency and workspace override select 4.0.0-beta.5 for the application and its modules. Browser authorization remains enabled.

Remove the override when Nuxt bundles DevTools 4. Verify that the Nuxt group opens in the dev panel after browser authorization.

## Portable request type inference

Nuxt 4.6's portable `defineEventHandler` does not preserve the callback's request input type. Nitro 2's extractors read H3 event types. `apps/pepega/shared/types/api-request.d.ts` preserves the callback and carries each validator's input through `ApiRequestEvent`. The `server:routes` hook registers these extractors after the server builder has installed its hooks.

Remove this bridge when Nuxt infers portable body and query contracts itself. Keep input types based on validation schemas, including input before a transform. Run `vp run test:typecheck`; the API contract tests must still check body and query shapes.

## Nitro 2 declarations and development imports

Nitro 2's declaration barrels use extensionless imports. The Nuxt Node context uses `module: 'preserve'` and `moduleResolution: 'bundler'` so Cloudflare configuration types resolve.

The Cloudflare development plugin also imports helpers from `#imports`. Keep `experimental.nitroAutoImports: true` until the installed plugin uses explicit imports. Application handlers already import from `nuxt/server`.

Remove each workaround after its upstream issue is fixed. Run type checks and start the development server; a successful production build alone does not check the development plugin.

## Nitro 2 Node compatibility detection

Keep `nodejs_compat` explicit in the application Wrangler configuration. The runtime enables it by date, but Nitro 2 still needs the flag to preserve native Node imports when `cloudflare.deployConfig` is false.

Remove the flag when Nitro detects date-enabled compatibility. Build the application and verify session creation and OAuth in a Workers runtime before deploying.

## Session migration

The application now uses Nuxt's sealed sessions with the existing `SESSION_SECRET`, cookie name, seven-day lifetime and cookie attributes. Existing H3 session cookies cannot be read in the new format. The first deployment of this change signs users out once; users can sign in again through Twitch.
