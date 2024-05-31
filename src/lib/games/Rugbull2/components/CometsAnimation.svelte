<script>
  import Comet from "./Comet.svelte";

  export let style = undefined;
  export let speed = 1;

  const comets = Array.from({length: 4})
  .map((_, i) => ({
    speed: Math.random() * 0.5 + 0.5,
    style: "transform: translate({Math.random() * 100}%, {Math.random() * 200 + 20}px)"
  }));
</script>

<div id="comets" {style}>
  {#each comets as it}
    <Comet
        speed={it.speed * speed}
        style={it.style}/>
    {/each}
</div>

<style>
  div {
    margin: 0 20px;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(2, 1fr);
  }
</style>