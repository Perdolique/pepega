<div class="component">
  <div class="content">
    <div class="progress">
      {#if isFailed}
        <div class="icon">💀</div>

        <div>
          Failed to connect <strong>Twitch</strong>
        </div>
      {:else}
        <FidgetSpinner size="32px" />

        <div>
          Connecting <strong>Twitch</strong>...
        </div>
      {/if}
    </div>
  </div>
</div>

<script lang="ts">
  import { goto,  } from '$app/navigation';
  import FidgetSpinner from '$lib/components/FidgetSpinner.svelte'
  import { onMount } from 'svelte';

  const { data } = $props()
  let isAuthFailed = $state(false)

  const isFailed = $derived.by(() => {
    if (data.code === undefined || isAuthFailed) {
      return true
    }

    return false
  })

  onMount(async () => {
    if (data.code === undefined) {
      return
    }

    try {
      const response = await fetch('/api/auth/twitch', {
        method: 'post',

        body: JSON.stringify({
          code: data.code
        })
      })

      if (response.ok) {
        // TODO: Save redirect path to local storage and redirect to it
        goto('/dashboard', {
          replaceState: true
        })
      } else {
        isAuthFailed = true
      }
    } catch (error) {
      isAuthFailed = true
    }
  })
</script>

<style>
  .component {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    padding: var(--spacing-24);
  }

  .content {
    display: grid;
    row-gap: var(--spacing-16);
    margin: auto;
    justify-items: center;
    text-align: center;
    text-wrap: balance;
  }

  .progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }

  .icon {
    font-size: 32px;
  }
</style>
