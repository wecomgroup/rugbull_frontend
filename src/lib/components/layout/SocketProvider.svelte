<script>
  import { initSocket, _socketConnected, userStore } from "$lib/stores";
  import { onMount } from "svelte";
  import AppLoader from "../loaders/AppLoader.svelte";
    import { uiStore } from "$lib/stores/_ui";

  const { user } = userStore;

  onMount(() => {
    initSocket();
  });

  $: {
    uiStore.toggleNavbar($_socketConnected);
  }
</script>

{#if $_socketConnected}
  <slot />
{:else if !$user.login}
  <div class="mx-auto w-fit grid h-screen items-center">
    <AppLoader text="Login to play" />
  </div>
{:else}
  <div class="mx-auto w-fit grid h-screen items-center">
    <AppLoader text="Loading" />
  </div>
{/if}
