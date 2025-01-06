<script lang="ts">
  import '$lib/styles/app.css'
  import Header from '$lib/components/Header.svelte'
  import { userState } from '$lib/state/user.svelte.js';

  let { children, data } = $props()

  userState.isAuthenticated = data.isAuthenticated
  userState.userId = data.userId
</script>

<Header />

{@render children()}
