<script>
  import {onMount} from "svelte";
  import {fly} from "svelte/transition";

  let mounted = false;

  const start = 20
  const diff = 10

  onMount(() => {
    mounted = true;
  });
</script>
<div class="BetModuleLayout grid gap-1">
  {#if mounted}
    <div in:fly={{y: start}} class="left" style="grid-area: a">
      <slot name="left"/>
    </div>
    <div in:fly={{y: start + diff }} class="right" style="grid-area: b">
      <slot name="right"/>
    </div>
    <div in:fly={{y: start + diff * 2}} class="bottom" style="grid-area: c">
      <slot name="bottom"/>
    </div>
    <div in:fly={{y: start + diff * 3}} style="grid-area: d">
      <slot name="button"/>
    </div>
  {/if}
</div>

<style lang="scss">
  .BetModuleLayout {
    border-radius: 1rem;
    overflow: hidden;

    & > * {
      background-color: var(--background-2);
      display: grid;
    }
  }
  .BetModuleLayout {
    grid-template-areas:
    "a b"
    "c c"
    "d d";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, minmax(30px, 1fr));
  }


</style>

