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
  <button on:click={() => setPage(1)}>
    <ChevronFirst/>
  </button>
  <button on:click={() => setPage(page - 1)}>
    <ChevronLeft/>
  </button>
  {#each pages as i}
    <button
        class="button-text"
        data-selected={page === i}
            on:click={() => setPage(i)}>{i}</button>
  {/each}
  <button on:click={() => setPage(page + 1)}>
    <ChevronRight/>
  </button>
  <button on:click={() => setPage(total)}>
    <ChevronLast/>
  </button>
</div>

<style lang="scss">
  .pagination-row {
    display: flex;
    align-items: stretch;

    gap: 8px;
  }

  button {
    display: grid;
    align-items: center;
    min-width: 16px;
    min-height: 16px;

    & > :global(svg) {
      width: 18px;
    }
  }

  .button-text {
    background-color: #444;

    &[data-selected=true] {
      background-color: var(--brand);
      color: black;
    }
  }

  @media (min-width: 375px) {
    button {
      min-width: 26px;
      min-height: 26px;

      & > :global(svg) {
        width: 20px;
      }
    }
  }


</style>