<script>
  import { userStore } from "$lib/stores/_user.js";
  import { isBrowser } from "$lib";
  import CopyablePre from "$lib/components/bet-controller/CopyablePre.svelte";

  let token;
  let w, h;

  const MENUS = [
    "/dev/home",
    { href: "/", label: "/Home" },
    "/login",
    "/components",
  ];
  const { user } = userStore;

  $: {
    if (isBrowser() || $user.login) {
      token = localStorage.getItem("token");
    }
  }

  if (isBrowser()) {
    w = window.innerWidth;
    h = window.innerHeight;
  }

  function logout() {
    localStorage.removeItem("token");
    location.reload();
  }
</script>

<main>
  <div class="flex gap-2">
    Open in
    <a href={`https://rugbull.me?token=${token}`} target="_blank">browser</a>
    <a href={`http://localhost:3000?token=${token}`} target="_blank"
      >localhost</a
    >
  </div>
  <div class="grid gap-1">
    {#each MENUS as menu}
      {#if typeof menu === "object"}
        <a href={menu.href}>{menu.label}</a>
      {:else}
        <a href={menu}>{menu}</a>
      {/if}
    {/each}
  </div>
  <button on:click={logout}>Logout</button>
  <CopyablePre label="token" text={token || "No token"} />
  <CopyablePre text={JSON.stringify($user, null, 2)} />
  <CopyablePre text={`${w} x ${h}`} />
</main>

<style>
  main {
    display: grid;
    gap: 1rem;
    padding: 1rem;
    max-width: 600px;
  }

  button {
    width: fit-content;
    padding: 0.5rem 1rem;
    background-color: var(--action);
    color: black;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
