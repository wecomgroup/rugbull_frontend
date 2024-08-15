<script>
  import { socketStore, userStore } from "$lib/stores";
  import { onMount } from "svelte";
  import AppLoader from "../loaders/AppLoader.svelte";
  import { uiStore } from "$lib/stores/_ui";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  const { user } = userStore;
  const { socketConnected } = socketStore;

  onMount(() => {
    if (browser) {
      if (!localStorage.getItem("token")) {
        goto("/login");
      } else {
        socketStore.initSocket();
      }
    }
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
