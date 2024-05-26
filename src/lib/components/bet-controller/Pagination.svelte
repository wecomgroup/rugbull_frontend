<script>
  import ChevronFirst from "$lib/icons/ChevronFirst.svelte";
  import ChevronLast from "$lib/icons/ChevronLast.svelte";
  import ChevronLeft from "$lib/icons/ChevronLeft.svelte";
  import ChevronRight from "$lib/icons/ChevronRight.svelte";

  export let total = 100;
  export let page = 1;
  export let numberButtons = 5;

  $: pages = Array.from({ length: Math.min(numberButtons, total) }, (_, i) => Math.max(1, Math.min(total - numberButtons + 1,  page - Math.floor(numberButtons / 2))) + i);

  function setPage(newPage) {
    page = Math.max(1, Math.min(total, newPage));
  }
</script>

<div class="pagination-row">
  <div class="button-svg-group">
    <button class="button-svg" on:click={() => setPage(1)}>
      <ChevronFirst/>
    </button>
    <button class="button-svg" on:click={() => setPage(page - 1)}>
      <ChevronLeft/>
    </button>
  </div>
  {#each pages as i}
    <button
        class="button-text"
        data-selected={page === i}
            on:click={() => setPage(i)}>{i}</button>
  {/each}
  <div class="button-svg-group">
    <button class="button-svg" on:click={() => setPage(page + 1)}>
      <ChevronRight/>
    </button>
    <button class="button-svg" on:click={() => setPage(total)}>
      <ChevronLast/>
    </button>
  </div>
</div>

<style lang="scss">
  .pagination-row {
    display: flex;
    align-items: stretch;

    gap: 8px;
  }

  .button-svg-group {
    display: flex;
    gap: 4px;
  }
  .button-svg {
    display: grid;
    align-items: center;
    justify-items: center;
    min-width: 26px;

    & > :global(svg) {
      width: 16px;
    }

    &:hover {
    background-color: var(--gray);
    }
  }

  .button-text {
    display: grid;
    align-items: center;
    min-width: 16px;
    min-height: 16px;
    background-color: #444;

    &[data-selected=true] {
      background-color: var(--brand);
      color: black;
    }
  }

  @media (min-width: 375px) {
    .button-text {
      min-width: 26px;
      min-height: 26px;

      & > :global(svg) {
        width: 20px;
      }
    }
  }


</style>