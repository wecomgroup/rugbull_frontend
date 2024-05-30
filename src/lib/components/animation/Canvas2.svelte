<script lang="js">
  export let ctx = undefined;
  export let style = undefined;
  let el

  $: {
    if (el) {
      ctx = el.getContext('2d')
    }
    else {
      ctx = undefined;
    }
  }
</script>

<canvas
    bind:this={el}
    {style}
/>