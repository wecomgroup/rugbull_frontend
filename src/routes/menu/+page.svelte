<script>
  import {MENUS} from "$lib/constants/menus.js";
</script>

<div>
  {#each MENUS as it}
    {#if typeof it === "object"}
      <a href="{it.href}">{it.label}</a>
    {:else}
      <a href="{it}">{it}</a>
    {/if}
  {/each}
</div>

<style lang="scss">
  div {
    display: grid;
    gap: 8px;
  }

  a {
    padding: 4px 8px;

    &:hover {
      background-color: darkgrey;
      color: black;
    }
  }
</style>