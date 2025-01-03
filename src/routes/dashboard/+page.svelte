<script lang="ts">
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'
</script>

<h1>Твой личный дашборд, братишка 😎</h1>

<p>
  Привет, { $page.data.userId }! Рад тебя видеть! 🎉
</p>

<form
  action="?/logout"
  method="POST"
  use:enhance
>
  <button type="submit" class="logout-button">
    Выйти из системы 👋
  </button>
</form>

<style>
  .logout-button {
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
