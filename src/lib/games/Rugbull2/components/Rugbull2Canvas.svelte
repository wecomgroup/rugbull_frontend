<script lang="js">
  import {onMount} from "svelte";
  import {spring} from "svelte/motion";
  import Canvas2 from "$lib/components/animation/Canvas2.svelte";
  import {Sprite} from "$lib/utils/Sprite.js";
  import {interpolateBezierCurve, interpolateLinear} from "$lib/utils/interpolate.js";
  import {createAnimationLoop} from "$lib";

  export let style = undefined;
  export let width = 400;
  export let height = 300;
  export let state = 0;
  export let distance = 0;
  export let multiplier = 1;

  let mouseScroll = 0;

  const bullSize = 100;
  const QUARTER = Math.PI / 4;

  /** @type CanvasRenderingContext2D */
  let ctx
  let log
  let drawCount = 0
  let t = Date.now();
  let t2 = 0; // time since animation started

  const bullPosition = spring(0, {stiffness: 0.03});

  const start = spring(0);
  const currentMultiplier = spring(1, {stiffness: 0.03})

  onMount(() => {
    start.set(100);
  });

  function wheel(e) {
    // mouseScroll += e.deltaY
    // console.log("wheel", mouseScroll)
    // e.preventDefault()
  }

  $: {
    if (state === 0) {
      bullPosition.set(0, {hard: true})
    } else if (state > 0) {
      bullPosition.set(1)
    }
  }
  $: {
    currentMultiplier.set(multiplier)
  }

  const RED = "red"
  const BLACK = "black"


  /// IMAGES
  const star = new Sprite("/images/rugbull2/stars.webp", {})
  const star2 = new Sprite("/images/rugbull2/stars-2.webp", {})
  const ground = new Sprite("/images/rugbull2/crater.webp", {})
  const comet = new Sprite("/images/rugbull2/comet.webp", {})

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
    fps: 10
  })
  const flag = new Sprite('/images/rugbull2/sprites/flag.webp', {
    rows: 4,
  })
  const tomb = new Sprite('/images/rugbull2/sprites/tomb.webp', {
    rows: 4,
    fps: 5,
  })


  onMount(() => {
    const animation = createAnimationLoop((props) => {
      t = Date.now()
      t2 = props.t;
    })
    animation.startLoop()
    return () => {
      animation.stopLoop()
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

      /// Frame variable
      const leftX = (w >= 400 ? w / 2 - 200 : 0)
      const rightX = (w >= 600 ? w / 2 + 300 : w)

      function block(fn) {
        ctx.save()
        fn()
        ctx.restore()
      }

      /// DRAW FUNCTIONS
      /// draw square at 4 corners
      function drawCorners({canvasWidth, canvasHeight}) {
        const size = 20;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size)
        ctx.fillRect(canvasWidth - size, 0, size, size)
        ctx.fillRect(0, canvasHeight - size, size, size)
        ctx.fillRect(canvasWidth - size, canvasHeight - size, size, size)
      }

      function drawRadiaGradient() {
        block(() => {
          const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, h);
          gradient.addColorStop(0.3, "rgba(0,0,0,0)");
          gradient.addColorStop(1, "rgba(0,0,0, 0.7)");
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, w, h)
        })
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
        const yBottom = h - bulls[0].heightOf(bullSize) / 2 - 20
        return interpolateBezierCurve(
          [bullSize / 2 + (leftX + 10), yBottom],
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
        const x = 120 - distance + leftX
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

      function drawMeter() {
        /// draw from right
        const x = rightX
        const y = h * 0.6
        const t1 = 6
        const t2 = 2
        const space = 180
        const COLOR1 = "rgba(255,255,255, 0.8)"
        const COLOR2 = "rgba(255,255,255, 0.6)"

        function colorFromDy(dy) {
          return `rgba(255,255,255, ${Math.max(0, 1.4 - Math.abs(dy) / 100)})`
        }

        function drawLine(mul) {
          block(() => {
            const scale = function (dy) {
              // return 1
              return (space - Math.abs(dy)) * 0.002 + 0.5
            }
            const fontSize = 24

            block(() => {
              const diff = $currentMultiplier - mul
              const dy = diff * space
              ctx.fillStyle = colorFromDy(dy)
              ctx.translate(x, y + dy)
              ctx.scale(scale(dy), scale(dy))
              ctx.fillRect(0, -t1 / 2, -30, t1)
              ctx.font = `normal ${fontSize}px sans-serif`
              ctx.fillText(`${mul.toFixed(1)}`, -50 - fontSize, fontSize / 2 - 3)
            })

            for (let i = 1; i < 5; i++) {
              block(() => {
                const diff = $currentMultiplier - (mul + i * 0.1)
                const dy = diff * space
                ctx.fillStyle = colorFromDy(dy)
                ctx.translate(x, y + dy)
                ctx.scale(scale(dy), scale(dy))
                ctx.fillRect(0, 0, -20, t2)
              })
            }
          })
        }

        function drawArrow() {
          block(() => {
            const triangleSize = 20
            const triangleH = 28
            ctx.translate(x, y)
            ctx.lineWidth = 4

            // Add three color stops
            const gradient = ctx.createLinearGradient(0, -10, 0, 10);
            gradient.addColorStop(1, "rgba(255,53,222, 0.95)");
            gradient.addColorStop(0, "rgba(4,150,255, 0.95)");
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.moveTo(0, -triangleH / 2)
            ctx.lineTo(-triangleSize * 0.7, -2)
            ctx.lineTo(-triangleSize * 0.7, 2)
            ctx.lineTo(0, +triangleH / 2)
            ctx.lineTo(0, -triangleH / 2)
            ctx.fill()
          })
        }

        const min = Math.max(0, Math.floor($currentMultiplier) - 1)
        Array.from({length: 6}).forEach((_, i) => {
          drawLine(min + i * 0.5)
        })
        drawArrow()
      }

      function drawGround() {
        block(() => {
          star.drawStatic(ctx, 0, 0, w, star.heightOf(w))
          star2.drawStatic(ctx, 0, 0, w, star2.heightOf(w))
        })

        block(() => {
          const height = 100
          const width = ground.widthOf(height)
          const dx = -(distance % width)
          ctx.translate(dx, h - height)
          ground.drawStatic(ctx, -width * 2, 0, width, height)
          ground.drawStatic(ctx, -width, 0, width, height)
          ground.drawStatic(ctx, 0, 0, width, height)
          ground.drawStatic(ctx, width, 0, width, height)
          ground.drawStatic(ctx, width * 2, 0, width, height)
        })

      }

      function drawComet({size, x, timeOffset = 0}) {
        block(() => {
          const duration = 150000 / size;
          const height = size
          const width = comet.widthOf(height)

          const angle = Math.PI / 4
          const t_ = ((t2 + timeOffset) % duration) / duration
          const life = Math.floor((t2 + timeOffset) / duration)

          /**@type {[number, number]} */
          const from = [(x + life * 4 * size) % (w * 1.2), 0]
          /**@type {[number, number]} */
          const to = [-width * Math.cos(angle), 0]


          to[1] = Math.tan(angle) * (from[0] - to[0]) + from[1]
          const d = interpolateLinear(from, to, t_)
          ctx.translate(d.x, d.y)
          ctx.rotate(-Math.PI / 4)


          comet.drawStatic(ctx, 0, 0, width, height)
        })
      }

      /// DRAW


      drawComet({size: 5, x: 200, timeOffset: 0})
      drawComet({size: 9, x: 350, timeOffset: 2000})
      drawComet({size: 12, x: 400, timeOffset: 2000})
      drawComet({size: 15, x: 100, timeOffset: 0,})
      drawComet({size: 17, x: 300, timeOffset: 5000})
      drawGround()
      drawFlag()
      drawBull()
      if (state === 5) drawTomb()
      // drawCorners({canvasWidth: w, canvasHeight: h})
      drawRadiaGradient()
      drawMeter()

      /// FINAL
      ctx.restore()
    }
  }

</script>

<div on:wheel={wheel}>
  <Canvas2 {width} {height} bind:ctx {style}/>
</div>

