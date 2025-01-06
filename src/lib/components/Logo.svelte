<script lang="ts">
  interface Props {
    to: string;
  }

  let { to } : Props = $props();
</script>

<a href={to}>
  Pepega
  <img src="/pepega.webp" alt="logo" />
</a>

<style>
  a {
    color: var(--color-text);
    text-decoration: none;
    display: inline flex;
    align-items: center;
    column-gap: 8px;
    font-size: 20px;
    font-weight: 300;
    transition: opacity var(--transition-fast);
    user-select: none;

    &:hover,
    &:focus-visible {
      opacity: 0.8;
    }
  }

  img {
    width: 32px;
    height: 32px;
  }
</style>
