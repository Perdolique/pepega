<script lang="ts">
  import { userState } from '$lib/state/user.svelte'
</script>

<h1>Это место для ровных пацанов 😎</h1>

{#if userState.isAuthenticated}
  <p>
    Красава, ты уже с нами! 🤝
  </p>

  <a href="/dashboard">
    Заходи на дашборд 🚀
  </a>
{:else}
  <p>
    Залетай к нам, бро! 👋
  </p>

  <a href="/login">
    Войти в систему 🎯
  </a>
{/if}
