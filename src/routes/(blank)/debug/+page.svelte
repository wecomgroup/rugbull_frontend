<script>
  import {_user} from "$lib/stores/_user.js";
  import {isBrowser} from "$lib";
  import CopyablePre from "$lib/components/bet-controller/CopyablePre.svelte";

  let token;
  let w,h;

  const MENUS = [
    "/dev/home",
    "/"
  ]

  $: {
    if (isBrowser() || $_user.login) {
      token = localStorage.getItem('token');
    }
  }


  if (isBrowser()) {
    w = window.innerWidth
    h = window.innerHeight
  }
</script>

<main>
  <a href={`http://localhost:3000?token=${token}`} target="_blank">Open in browser</a>
  <div class="grid gap-1">
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
  <CopyablePre text={JSON.stringify($_user, null, 2)}/>
  <CopyablePre text={`${w} x ${h}`}/>
</main>

<style>
  main {
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }
</style>

