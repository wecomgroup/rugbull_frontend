<script>
  import ResultNumber from "$lib/games/Rugbull2/components/ResultNumber.svelte";

  export let results = [10.2, 5.2, 3.2, 1.2, 182, 0, 1.12, 5.98];
  export let time = 1;
</script>

<div class="flex gap-2" style="min-height: 32px">
  {#each results as it}
    <ResultNumber value={it}/>
  {/each}
</div>

<style>
  div {
    overflow: auto;
  }
</style>