<script lang="ts">
  import { enhance } from '$app/forms'
</script>

<h1>Заходи, бро! 👋</h1>

<form
  method="POST"
  action="?/login"
  use:enhance
>
  <button type="submit" class="login-button">
    Login
  </button>
</form>

<style>
  .login-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
