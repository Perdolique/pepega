<template>
  <div :class="$style.component">
    <SimpleButton
      :class="$style.button"
      icon-name="tabler:brand-twitch"
      @click="redirectToTwitch"
    >
      Login with Twitch
    </SimpleButton>
  </div>
</template>

<script setup lang="ts">
  import SimpleButton from '~/components/SimpleButton.vue';

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

    @media (hover: hover) {
      &:hover {
        background-color: oklch(50% 0.25 296.09);
      }
    }
  }
</style>
