<script>
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  export let style = undefined;

  const t = spring(0);
  onMount(() => {
    t.set(100);
  });

  $: x = 100 * $t / 100;
  $: y = -100 * $t / 100;
</script>

<div class="relative" {style}>
  <img
    alt="main character"
    width="100"
    height="100"
    src="/images/rugbull2/bull/a.gif"
    style="transform: translate({x}%, {y}%);"
  />
</div>

<style>
  div {
    border: 2px solid red;
    box-sizing: border-box;
  }

  img {
    position: absolute;
    bottom: 0;
  }
</style>
