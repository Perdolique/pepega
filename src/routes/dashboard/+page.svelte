<script lang="ts">
  import { enhance } from '$app/forms'
</script>

<h1>Твой личный дашборд, братишка 😎</h1>

<form
  action="?/logout"
  method="POST"
  use:enhance
>
  <button type="submit">
    Выйти из системы 👋
  </button>
</form>
