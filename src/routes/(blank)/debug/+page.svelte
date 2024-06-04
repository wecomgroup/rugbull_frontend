<script>
  import {user} from "$lib/stores/_user.js";
  import {isBrowser} from "$lib";
  import CopyablePre from "$lib/components/bet-controller/CopyablePre.svelte";

  let token;
  let w,h;

  const MENUS = [
    {name: "Home", href: "/"},
    "/dev/games/rugbull2",
    "/dev/components",
  ]

  $: {
    if (isBrowser() || $user.login) {
      token = localStorage.getItem('token');
    }
  }


  if (isBrowser()) {
    w = window.innerWidth
    h = window.innerHeight
  }
</script>

<main>
  <div class="flex gap-1">
    {#each MENUS as menu}
      {#if typeof menu === "object"}
        <a href={menu.href}>{menu.name}</a>
      {:else}
        <a href={menu}>{menu}</a>
      {/if}
    {/each}
  </div>
  <CopyablePre
      text={token || "No token"}/>
  <CopyablePre text={JSON.stringify($user, null, 2)}/>
  <CopyablePre text={`${w} x ${h}`}/>
</main>

<style>
  main {
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }
</style>

