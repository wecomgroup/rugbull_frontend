<script>
  import {onMount} from "svelte";
  import {spring} from "svelte/motion";
  import Canvas2 from "$lib/components/animation/Canvas2.svelte";
  import loadImage from "$lib/utils/loadImage";
  import {Sprite} from "$lib/utils/Sprite.js";

  export let style = undefined;

  /** @type CanvasRenderingContext2D */
  let ctx
  let log
  let drawCount = 0
  let t = Date.now();

  const start = spring(0);
  onMount(() => {
    start.set(100);
  });

  const RED = "red"
  const BLACK = "black"

  /// IMAGES
  const bullA = new Sprite('/images/rugbull2/bull/a-sprite.png', {
    columns: 2,
  })

  onMount(() => {
    const i = setInterval(() => {
      t = Date.now()
    }, 100)
    return () => {
      clearInterval(i)
    }
  })

  $: {
    if (ctx) {
      drawCount++

      const {width: canvasWidth, height: canvasHeight} = ctx.canvas
      log = `${canvasWidth} x ${canvasHeight}`

      ctx.save();

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = RED;

      bullA.draw(ctx, t, 0, 0, 100)
      ctx.restore()
    }
  }

</script>

{log} {drawCount}
<Canvas2 bind:ctx/>

