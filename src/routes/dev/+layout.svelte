<script>
  const MENUS = [
    '/dev/components',
    '/dev/games/rugbull2',
  ]
</script>

<div class="page grid">
  <div class="menu p-2">
    {#each MENUS as it}
      <a class="p-1 rounded-1" href={it}>{it}</a>
    {/each}
  </div>

  <slot/>
</div>

<style>
  .page {
    grid-template-columns: 120px 1fr;
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