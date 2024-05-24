<script lang="js">
  export let src;

  let innerHeight
  let setting = {

    width: "320px",
    scale: "normal"
  }

  const settings = [
    {
      label: "mobile 320",
      width: "320px",
      scale: "scale-100"
    },
    {
      label: "mobile 375",
      width: "375px",
      scale: "scale-100"
    },
    {
      label: "fold 568",
      width: "568px",
      scale: "scale-75"
    },
    {
      label: "tablet 768",
      width: "768px",
      scale: "scale-75"
    },
    {
      label: "laptop 1024",
      width: "1024px",
      scale: "scale-50"
    }
  ]

</script>
<svelte:window bind:innerHeight/>

<main>
  <div class="row">
    {#each settings as it}
      <button on:click={() => setting= it}>{it.label}</button>
    {/each}
  </div>

  <div class="iframe-container">
    <iframe title="components"
            {src}
            class={setting.scale}
            width="{setting.width}"
            height="{Math.min(800, Math.floor(innerHeight * 0.8))}px"
            frameborder="0"
    />
  </div>
</main>

<style lang="scss">
  main {
    margin-top: 80px;
    display: grid;
    justify-items: center;
    align-items: center;
    gap: 20px;
  }

  .iframe-container {
    display: grid;
    justify-content: center;
    width: 0;
  }
  iframe {
    border: 1px dashed rgba(255, 255, 255, 0.2);
  }

  .scale-50 {
    -ms-zoom: 0.50;
    -moz-transform: scale(0.50);
    -o-transform: scale(0.50);
    -webkit-transform: scale(0.50);
    -moz-transform-origin: 50% 0;
    -o-transform-origin: 50% 0;
    -webkit-transform-origin: 50% 0;
  }

  .scale-75 {
    -ms-zoom: 0.75;
    -moz-transform: scale(0.75);
    -o-transform: scale(0.75);
    -webkit-transform: scale(0.75);
    -moz-transform-origin: 50% 0;
    -o-transform-origin: 50% 0;
    -webkit-transform-origin: 50% 0;
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