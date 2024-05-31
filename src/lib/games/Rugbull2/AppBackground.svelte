<script lang="js">
  import ScrollableImage from "$lib/games/Rugbull2/components/ScrollableImage.svelte";
  import CometsAnimation from "$lib/games/Rugbull2/components/CometsAnimation.svelte";

  export let distance = 0;
  export let speed = 1;
</script>

<!--Background -->
<div class="background noselect">

  <!--Crater -->
  <div class="ground grid-ground">
    <ScrollableImage x={distance}
                     height="100px"
                     src="/images/rugbull2/crater.webp"
    />
  </div>

  <!--Star background -->
  <div class="layer grid-full"/>
  <img class="grid-full" alt="stars" src="/images/rugbull2/stars.webp" style="object-fit: cover"/>
  <img class="grid-full" alt="stars" src="/images/rugbull2/stars-2.webp" style="object-fit: cover"/>

  <div class="grid-top">
    <CometsAnimation speed={speed} style="height: 60%;"/>
  </div>

  <div class="grid-header" style="z-index: 2">
    <slot name="header"/>
  </div>

  <div class="grid-sub-header" style="z-index: 2">
    <slot name="sub-header"/>
  </div>

  <div style="grid-column: 1; grid-row: 3/-1; z-index: 2">
    <slot name="body"/>
  </div>
</div>


<style lang="scss">
  .background {
    background: #111830;
    height: 435px;
    overflow: hidden;

    display: grid;
    grid-template-rows: auto auto 1fr auto;

    .grid-full {
      grid-row: 1 / -1;
      grid-column: 1;
      width: 100%;
    }

    .grid-header {
      grid-row: 1;
      grid-column: 1;
    }

    .grid-sub-header {
      grid-row: 2;
      grid-column: 1;
    }

    .grid-ground {
      grid-row: 4;
      grid-column: 1;
    }

    .grid-top {
      grid-row: 1/span 3;
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