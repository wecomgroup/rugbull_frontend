<script lang="js">
  export let x = 0;
  export let height = "50px";
  export let src = "/images/rugbull2/crater.webp"

  let totalW, imgW, displayW;

  $: loading = !totalW || !imgW || !displayW;
  $: needW = displayW * 3 + imgW;
  $: count = Math.max(3, Math.ceil(needW / imgW) || 0);

  $: adjustedX = Math.abs(x % (imgW * Math.floor(count / 2)));

</script>

<div class="scrollable-image"
     style="height:{height}"
     bind:clientWidth={displayW}
>
  <div class="images-wrapper" style="transform: translate(-{adjustedX}px, 0); height:{height}"
       bind:clientWidth={totalW}>
    <div bind:clientWidth={imgW} style="display: flex">
      <img alt="crater" {src}/>
    </div>
    <img alt="crater" {src} style="margin-left:-1px"/>
    <img alt="crater" {src} style="margin-left:-1px"/>
    {#if !loading}
      {#each Array.from({length: count - 3}) as it,index}
        <img alt="crater" {src} style="margin-left:-{index+1}px"/>
      {/each}
    {/if}
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

