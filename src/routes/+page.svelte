<script lang="ts">  
  let { data } = $props()
</script>

<div style="text-align: center;">
  <img src="/path/to/logo.png" alt="Logo" />
  <h1 style="font-family: 'Inter Variable', sans-serif;">Welcome to Pepega</h1>
</div>

{#if data.isAuthorized}
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
