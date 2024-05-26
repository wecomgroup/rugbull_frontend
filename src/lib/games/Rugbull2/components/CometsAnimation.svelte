<script>
  import Comet from "./Comet.svelte";

  export let style = undefined;

</script>

<div id="comets" {style}>
  <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 200 + 20}px)"/>
  <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 200 + 20}px)"/>
  <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 200 + 20}px)"/>
</div>

<style>
  div {
    margin: 0 20px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr)
  }
</style>