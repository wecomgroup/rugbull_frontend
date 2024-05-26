<script>

  import {createAnimationLoop} from "$lib";
  import {onMount} from "svelte";

  import {spring} from 'svelte/motion';

  export let style = undefined;
  export let restartAfter = 1000;

  let speed = Math.random() * 0.5 + 0.5
  const time = spring()

  function restart() {
    time.set(-1000, {hard: true})
    time.set(0)
  }

  onMount(() => {
    restart()
    const sub = createAnimationLoop(({dt}) => {
      time.update(t => t + dt / 10 * speed)
    })
    sub.startLoop()
    return () => {
      sub.stopLoop()
    }
  })

  $: x = -$time / 20
  $: y = $time / 20
  $: if ($time > restartAfter) restart()

</script>
<div {style}>
  <div class="comet" style="transform: translate({x}px, {y}px)">
    <img alt="comet" src="/images/rugbull2/comet.webp"
         style="transform: rotate(-45deg) scale(0.3);"
    />
  </div>
</div>

<style>
  .comet {
    pointer-events: none;
  }

  img {
    transform-origin: 0 -50%;
    position: fixed;
  }
</style>
