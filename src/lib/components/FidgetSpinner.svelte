<script lang="ts">
  import FidgetSpinnerIcon from '~icons/tabler/fidget-spinner'
  import '$lib/styles/animation.css'

  interface Props {
    size?: string;
  }

  let { size = '1em' } : Props = $props()
</script>

<FidgetSpinnerIcon
  style="
    animation: spin 1s linear infinite;
    width: {size};
    height: {size};
  "
/>
