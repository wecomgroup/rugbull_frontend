<script lang="js">
  let innerHeight
  let width = "320px"

  const sizes = [
    "320px","375px","568px","768px","1024px"
  ]
</script>
<svelte:window bind:innerHeight />

<main>
  <div class="row">
    {#each sizes as size}
      <button on:click={() => width = size}>{size}</button>
    {/each}
  </div>

  <iframe title="components" src="/components/raw"
          width="{width}"
          height="{Math.min(800, Math.floor(innerHeight * 0.8))}px"
          frameborder="0"
  />
</main>

<style lang="scss">
  main {
    margin-top: 80px;
    display: grid;
    justify-items: center;
    align-items: center;
    gap: 20px;
  }

  iframe {
    border: 1px dashed rgba(255,255, 255, 0.2);
  }

  button {
    border: 1px solid white;
    width: fit-content;
    padding: 4px 8px;
    &:hover {
      background-color: white;
      color: black;
    }
  }

  .row {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
</style>