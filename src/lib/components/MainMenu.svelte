<script lang="ts">
  import MenuIcon from '~icons/streamline-emojis/frog-face'
  import { userState } from '$lib/state/user.svelte'
</script>

<div class="container">
  <button class="component">
    <MenuIcon style="height: 1em; width: 1em" />
  </button>

  <div class="menu">
    {#if userState.isAuthenticated}
      <a href="/dashboard">Dashboard</a>
    {:else}
      <a href="/login">Login</a>
    {/if}
  </div>
</div>

<style>
  .component {
    /* Reset */
    appearance: none;
    border: none;
    outline: none;

    /* Styles */
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color var(--transition-fast);
    cursor: pointer;
    font-size: 20px;

    &:hover,
    &:focus-visible {
      background-color: var(--color-primary);
    }
  }
</style>
