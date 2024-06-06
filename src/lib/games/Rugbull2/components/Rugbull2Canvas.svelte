<script lang="js">
  import {onMount} from "svelte";
  import {spring} from "svelte/motion";
  import Canvas2 from "$lib/components/animation/Canvas2.svelte";
  import {Sprite} from "$lib/utils/Sprite.js";
  import {interpolateBezierCurve} from "$lib/utils/interpolate.js";

  export let style = undefined;
  export let width = 400;
  export let height = 300;
  export let state = 0;
  export let distance = 0;

  const bullSize = 100;
  const QUARTER = Math.PI / 4;

  /** @type CanvasRenderingContext2D */
  let ctx
  let log
  let drawCount = 0
  let t = Date.now();

  const bullPosition = spring(0, {stiffness: 0.03});

  const start = spring(0);
  onMount(() => {
    start.set(100);
  });
  $: {
    if (state === 0) {
      bullPosition.set(0, {hard: true})
    } else if (state > 0) {
      bullPosition.set(1)
    }
  }

  const RED = "red"
  const BLACK = "black"

  /// IMAGES

  const bulls = [
    new Sprite('/images/rugbull2/sprites/a.webp', {
      columns: 2,
    }),
    new Sprite('/images/rugbull2/sprites/a.webp', {
      columns: 2,
    }),
    new Sprite('/images/rugbull2/sprites/b.webp', {
      columns: 2,
    }),
    new Sprite('/images/rugbull2/sprites/c.webp', {
      columns: 2,
    }),
    new Sprite('/images/rugbull2/sprites/d.webp', {
      columns: 2,
    }),
    new Sprite('/images/rugbull2/sprites/smoke.webp', {
      rows: 10,
      fps: 8,
    })
  ]

  const booster = new Sprite('/images/rugbull2/sprites/fire.webp', {
    columns: 8,
  })
  const flag = new Sprite('/images/rugbull2/sprites/flag.webp', {
    rows: 4,
  })
  const tomb = new Sprite('/images/rugbull2/sprites/tomb.webp', {
    rows: 4,
    fps: 5,
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

      /// CLEAR CANVAS
      const {width: w, height: h} = ctx.canvas
      log = `${w} x ${h}`

      ctx.save();

      ctx.clearRect(0, 0, w, h);

      function block(fn) {
        ctx.save()
        fn()
        ctx.restore()
      }

      /// DRAW FUNCTIONS
      /// draw square at 4 corners
      function drawCorners({canvasWidth, canvasHeight}) {
        const size = 10;
        ctx.fillStyle = RED;
        ctx.fillRect(0, 0, size, size)
        ctx.fillRect(canvasWidth - size, 0, size, size)
        ctx.fillRect(0, canvasHeight - size, size, size)
        ctx.fillRect(canvasWidth - size, canvasHeight - size, size, size)
      }

      function drawPoint() {
        ctx.fillStyle = RED;
        ctx.fillRect(-5, -5, 10, 10);
      }

      function getBullLocation() {
        const yBottom = h - bulls[0].heightOf(bullSize) / 2
        return interpolateBezierCurve(
          [bullSize / 2 + 10, yBottom],
          [w / 2 + 10, yBottom],
          [w / 2 + 10, h / 2 - 40],
          $bullPosition
        )
      }

      function getBullLocation2() {
        const yBottom = h - bulls[0].heightOf(bullSize) / 2
        return interpolateBezierCurve(
          [bullSize / 2 + 10, yBottom],
          [w / 2 + 40, yBottom],
          [w / 2 + 40, yBottom - 40],
          $bullPosition
        )
      }

      function drawBull() {
        const {x, y} = getBullLocation2()
        ctx.save()
        ctx.translate(x, y)

        // const fireScale = [0, 0.4, 0.6, 0.9, 1.2, 0]
        // const firePlacement = [0, 1.3, 1.3, 1.2, 1.15, -.3]
        // const bullScale = [1, 1, 1.2, 1.4, 1.6, 2.0]
        // const angle = [0, -0.2, -0.5, -0.60, -0.8]
        // const boosterAngle = -2.3

        const fireScale = [0, 0.4, 0.6, 0.9, 1.2, 0]
        const firePlacement = [0, 1.3, 1.3, 1.2, 1.15, -.3]
        const bullScale = [1, 1, 1.2, 1.4, 1.6, 2.0]
        const angle = [0, 0, 0, 0, 0]
        const boosterAngle = -2.0

        block(() => {
          ctx.scale(fireScale[state], fireScale[state])
          ctx.rotate((boosterAngle + angle[state]) * QUARTER)
          ctx.translate(-0.5 * bullSize, -(firePlacement[state]) * booster.heightOf(bullSize))
          booster.draw(ctx, t, 0, 0, bullSize)
        })

        block(() => {
          ctx.rotate(angle[state] * QUARTER)
          ctx.scale(bullScale[state], bullScale[state])
          ctx.translate(-0.5 * bullSize, -0.5 * bulls[state].heightOf(bullSize))
          bulls[state].draw(ctx, t, 0, 0, bullSize)
        })


        ctx.restore()
      }

      function drawFlag() {
        const x = 130 - distance
        const y = h - 40
        block(() => {
          ctx.translate(x, y)
          flag.draw(ctx, t, 0, -flag.heightOf(140), 140)
        })
      }

      function drawTomb() {
        const imgW = 80
        const x = (w - imgW) / 2 + 40
        const y = h
        block(() => {
          ctx.translate(x, y)
          tomb.draw(ctx, t, 0, -flag.heightOf(imgW), imgW)
        })
      }

      /// DRAW


      drawFlag()
      drawBull()
      if (state === 5) drawTomb()
      drawCorners({canvasWidth: w, canvasHeight: h})

      /// FINAL
      ctx.restore()
    }
  }

</script>

<Canvas2 {width} {height} bind:ctx {style}/>

