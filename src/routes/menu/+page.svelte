<script>
  import {MENUS} from "$lib/constants/menus.js";
</script>

<div>
  {#each MENUS as menu}
    <a href="{menu.href}">{menu.label}</a>
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