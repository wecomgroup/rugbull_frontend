<script lang="js">

  export let distance = 0;
  export let speed = 1;
  export let hideGround = false;
  export let fullScreen = false;
</script>

<!--Background -->
<div class="background noselect" class:full-screen={fullScreen}>

  <!--Crater -->


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
    height: 360px;
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

    .ground {
      z-index: 1;
    }


  }
  .full-screen {
    height: 100vh;
  }

</style>