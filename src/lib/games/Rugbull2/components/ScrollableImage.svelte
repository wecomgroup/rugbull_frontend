<script lang="js">
  export let x = 0;
  export let height = "50px";
  export let src = "/images/rugbull2/crater.webp"

  let totalW;

  $: adjustedX = Math.abs(x % (totalW / 3)) + (totalW / 3);
</script>

<div class="scrollable-image"
     style="height:{height}"
>
  <div class="images-wrapper" style="transform: translate(-{adjustedX}px, 0); height:{height}" bind:clientWidth={totalW}>
    <img alt="crater" {src} />
    <img alt="crater" {src} style="margin-left:-1px"/>
    <img alt="crater" {src} style="margin-left:-2px"/>
  </div>
</div>


<style>
  .scrollable-image {
    display: flex;
    position: relative;
    overflow: hidden;
  }

  .images-wrapper {
    position: absolute;
    left: 0;
    display: flex;
  }
</style>

