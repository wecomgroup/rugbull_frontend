<script>
  import { initSocket, _socketConnected } from "$lib/stores";
  import { onMount } from "svelte";
  import AppLoader from "../loaders/AppLoader.svelte";

  onMount(() => {
    initSocket();
  });

  $: {
    console.log($_socketConnected);
  }
</script>

{#if $_socketConnected}
  <slot />
{:else}
  <div class="mx-auto w-fit grid h-screen items-center">
    <AppLoader />
  </div>
{/if}
