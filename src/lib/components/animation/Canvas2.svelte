<script lang="js">
  export let ctx = undefined;
  export let style = undefined;
  export let width = 400;
  export let height = 400;

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
    {width}
    {height}
    {style}
/>