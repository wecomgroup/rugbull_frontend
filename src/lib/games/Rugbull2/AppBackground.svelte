<script lang="js">
  import {spring} from 'svelte/motion';
  import {fly} from 'svelte/transition';
  import {onMount} from "svelte";
  import ScrollableImage from "$lib/games/Rugbull2/components/ScrollableImage.svelte";
  import {createAnimationLoop} from "$lib";
  import Comet from "$lib/games/Rugbull2/components/Comet.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";

  const START = -500
  const backgroundX = spring(0, {
    stiffness: 0.1,
  });


  onMount(() => {
    backgroundX.set(START);


    function mouseMove(e) {
      backgroundX.set(START - e.clientX * 0.2);
    }

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    }
  })

</script>

<!--Background -->
<div class="background">

  <!--Crater -->
  <div class="ground grid-ground">
    <ScrollableImage x={$backgroundX}
                     height="100px"
                     src="/images/rugbull2/crater.webp"
    />
  </div>

  <!--Star background -->
  <div class="layer grid-full"/>
  <img class="grid-full" alt="stars" src="/images/rugbull2/stars.webp" style="object-fit: cover"/>
  <img class="grid-full" alt="stars" src="/images/rugbull2/stars-2.webp" style="object-fit: cover"/>

  <div id="comets" class="grid-top" style="margin: 0 20px;width: 100%; display: grid; grid-template-columns: repeat(3, 1fr)">
    <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 200 + 20}px)"/>
    <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 200 + 20}px)"/>
    <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 200 + 20}px)"/>
  </div>

</div>


<style lang="scss">
  .background {
    background: #111830;
    height: 435px;
    overflow: hidden;

    display: grid;
    grid-template-rows: 1fr auto;

    .grid-full {
      grid-row: 1/-1;
      grid-column: 1;
      width: 100%;
    }

    .grid-ground {
      grid-row: 2;
      grid-column: 1;
    }

    .grid-top {
      grid-row: 1;
      grid-column: 1;
    }


    .layer {
      z-index: 2;
      background: radial-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.7));
    }

    .ground {
      z-index: 1;
    }


  }


</style>