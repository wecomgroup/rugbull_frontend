<script lang="js">
  import {spring} from 'svelte/motion';
  import {onMount} from "svelte";
  import ScrollableImage from "$lib/games/Rugbull2/components/ScrollableImage.svelte";
  import CometsAnimation from "$lib/games/Rugbull2/components/CometsAnimation.svelte";

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
<div class="background noselect">

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

  <div class="grid-top">
    <CometsAnimation/>
  </div>

  <div class="grid-header" style="z-index: 2">
    <slot name="header"/>
  </div>
</div>


<style lang="scss">
  .background {
    background: #111830;
    height: 435px;
    overflow: hidden;

    display: grid;
    grid-template-rows: auto 1fr auto;

    .grid-full {
      grid-row: 1 / -1;
      grid-column: 1;
      width: 100%;
    }

    .grid-ground {
      grid-row: 3;
      grid-column: 1;
    }

    .grid-top {
      grid-row: 1/span 2;
      grid-column: 1;
    }

    .grid-header {
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