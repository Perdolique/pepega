interface SessionData {
	userId: string;
}

/**
 * @see {@link https://svelte.dev/docs/kit/types#app.d.ts}
 */
declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface Locals {
			userId?: string;
		}
	}
}

export {}
