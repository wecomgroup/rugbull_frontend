<script>
  import {user} from "$lib/stores/_user.js";
  import {isBrowser} from "$lib";
  import CopyablePre from "$lib/components/bet-controller/CopyablePre.svelte";

  let token;
  $: {
    if (isBrowser() || $user.login) {
      token = localStorage.getItem('token');
    }
  }
</script>

<main>
  <div class="flex gap-1">
    <a href="/">Home</a>
  </div>
  <CopyablePre
      text={token || "No token"}/>
  <CopyablePre text={JSON.stringify($user, null, 2)} />
</main>

<style>
  main {
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }
</style>

