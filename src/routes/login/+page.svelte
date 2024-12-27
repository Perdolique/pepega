<script lang="ts">
  import { enhance } from '$app/forms'
</script>

<h1>Заходи, бро! 👋</h1>

<form 
  method="POST"
  action="?/login"
  use:enhance
>
  <button type="submit">Login</button>
</form>
