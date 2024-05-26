<script lang="ts">
  import {fly} from 'svelte/transition';
  export let multiplierHistory: number[] = [];
</script>
<div style="display: grid; position: relative;">
  <div class="history-row scrollbar-background">
    {#if multiplierHistory.length === 0}
      <div in:fly={{x: -20}} class="history-row-item">Loading...</div>
    {/if}
    {#each multiplierHistory as i}
      <div in:fly={{x: -20}} class="history-row-item"
           data-variant={i > 10 ? 'brand' : ''}>{i < 10 ? i.toFixed(2) : i.toFixed(0)}</div>
    {/each}
  </div>
  <div class="overlay"/>
</div>

<style lang="scss">
  .history-row {
    display: flex;
    gap: 4px;
    overflow: auto;

    .history-row-item {
      padding: 4px 8px;
      background-color: #3b4a60;

      &[data-variant=brand] {
        background-color: var(--brand);
        color: black;
      }
    }

  }

</style>