<script>
  import {hashToNumber} from "$lib/games/Rugbull/decrypt.js";
  import {createEventDispatcher} from "svelte";

  export let results

  const dispatch = createEventDispatcher()

</script>

<div class="grid gap-2">
  <div class="header flex sticky top-0 pb-2">
    <div class="label">Round / Hash</div>
    <div class="flex-1"/>
    <div class="label">Multiplier</div>
  </div>
  {#each results as {round, encryption}}
    {@const multiplier = hashToNumber(encryption)}
    <button class="flex gap-2" on:click={() => dispatch('click',  encryption)}>
      <div class="flex flex-col items-start gap-2">
        {round}
        <div class="encryption">
          {encryption}
        </div>
      </div>
      {multiplier.toFixed(6)}
    </button>
  {/each}
</div>

<style>
  .header {
    background-color: var(--background);
  }
    button {
      background: var(--background-2);
      padding: 0.5rem;
      border-radius: 0.5rem;
    }
    .encryption {
      white-space: pre-line;
      word-break: break-all;
      text-align: left;

      text-decoration: underline;
    }
</style>


