<script>
  import { socketStore, userStore } from "$lib/stores";
  import { onMount } from "svelte";
  import AppLoader from "../loaders/AppLoader.svelte";
  import { uiStore } from "$lib/stores/_ui";

  const { user } = userStore;
  const { socketConnected } = socketStore;

  onMount(() => {
    socketStore.initSocket();
  });

  $: {
    uiStore.toggleNavbar($socketConnected);
  }
</script>

{#if $socketConnected}
  <slot />
{:else if $user.login}
  <div class="mx-auto w-fit grid h-screen items-center">
    <AppLoader text="Loading" />
  </div>
{:else}
  <div class="mx-auto w-fit grid h-screen items-center">
    <AppLoader text="Login you in" />
  </div>
{/if}
