<template>
  <div :class="$style.component">
    <button
      :class="$style.button"
      @click="redirectToTwitch"
    >
      <Icon
        :class="$style.icon"
        name="tabler:brand-twitch"
      />

      Login with Twitch
    </button>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()

  function redirectToTwitch() {
    const { redirectTo } = route.query
    const queryParam = redirectTo ? `?redirectTo=${redirectTo}` : ''

    window.location.replace(`/api/oauth/twitch${queryParam}`)
  }
</script>

<style module>
  .component {
    display: grid;
    justify-items: center;
  }

  .button {
    background-color: oklch(59% 0.25 296.09);
    color: white;
    height: 48px;
    padding: 0 var(--spacing-24);
    border-radius: var(--border-radius-12);
    display: flex;
    align-items: center;
    column-gap: var(--spacing-8);
    transition: background-color var(--transition-fast);

    @media (hover: hover) {
      &:hover {
        background-color: oklch(50% 0.25 296.09);
      }
    }
  }

  .icon {
    font-size: 20px;
  }
</style>
