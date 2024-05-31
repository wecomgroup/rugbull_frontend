<script>

  import {createAnimationLoop} from "$lib";
  import {onMount} from "svelte";

  import {spring} from 'svelte/motion';

  export let style = undefined;
  export let restartAfter = 4000;
  export let speed = 1;

  let count = 0;

  const time = spring(0, {stiffness: 0.2})

  function restart() {
    count++;
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
{#key count}
  <div style="transform: translate({Math.random() * 100}%, {Math.random() * 200 + 20}px)">
    <div class="comet" style="transform: translate({x}px, {y}px)">
      <img alt="comet" src="/images/rugbull2/comet.webp"
           style="transform: rotate(-45deg) scale(0.3);"
      />
    </div>
  </div>
{/key}

<style>
  .comet {
    pointer-events: none;
  }

  img {
    transform-origin: 0 -50%;
    position: fixed;
  }
</style>
