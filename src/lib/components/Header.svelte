<script lang="ts">
  import Logo from "$lib/components/Logo.svelte"
  import MainMenu from "$lib/components/MainMenu.svelte"
  import FidgetSpinnerIcon from '~icons/tabler/fidget-spinner'
</script>

<header>
  <MainMenu />
  <Logo to="/" />
  <FidgetSpinnerIcon />
</header>

<style>
  header {
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: space-between;
    column-gap: var(--spacing-16);
    padding: var(--spacing-16);
  }
</style>
