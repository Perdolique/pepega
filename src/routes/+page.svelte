<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();
</script>

<h1>Welcome to Pepega</h1>
<p>Visit <a href="https://github.com/Perdolique/pepega">Perdolique/pepega</a> to read the documentation</p>

{#if form?.error}
  <p class="error">
    {form.error}
  </p>
{/if}

{#if data.isAuthorized}
  <p>Привет, {data.userId}!</p>

  <form 
    method="POST"
    action="?/logout"
    use:enhance
  >
    <button type="submit">Logout</button>
  </form>
{:else}
  <form 
    method="POST"
    action="?/login"
    use:enhance
  >
    <button type="submit">Login</button>
  </form>
{/if}
