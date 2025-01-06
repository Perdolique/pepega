<script lang="ts">
  import { enhance } from '$app/forms'
  import { userState } from '$lib/state/user.svelte'
  import { goto } from '$app/navigation'
  import type { SubmitFunction } from './$types';

  const onSubmit : SubmitFunction = () => {
		return async ({ update, result }) => {
			await update()

			if (result.type === 'success') {
        userState.resetAuth()

        goto('/')
      }
		};
	}
</script>

<h1>Твой личный дашборд, братишка 😎</h1>

<form
  action="?/logout"
  method="POST"
  use:enhance={onSubmit}
>
  <button type="submit">
    Выйти из системы 👋
  </button>
</form>
