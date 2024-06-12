<script>
  const MENUS = [
    '/dev/home',
    '/dev/magic-cards',
    '/dev/components',
    '/dev/debug',
  ]
</script>

<main class="page grid items-center">
  <slot/>

  <div class="menu p-2">
    {#each MENUS as it}
      <a class="p-1 rounded-1" href={it}>{it}</a>
    {/each}
  </div>
</main>

<style>
  main {
    grid-template-rows: 1fr auto;
  }

  .menu {
    display: flex;
    flex-direction: column;
  }

  a {
    text-decoration: none;
    word-break: break-all;
  }

  a:hover {
    background-color: var(--hover);
  }
</style>