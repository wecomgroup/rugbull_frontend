<script>
  import ResultNumber from "$lib/games/Rugbull2/components/ResultNumber.svelte";

  export let results = [10.2, 5.2, 3.2, 1.2];
  export let time = 1;
</script>

<div class="flex gap-2" style="min-height: 32px">
  {#each results as it}
    <ResultNumber value={it}/>
  {/each}
</div>