<script lang="ts">
  import type {CanvasValue} from '$lib/components/Canvas';
  import {Canvas, createAnimationLoop, loadImage} from '$lib';
  import {onMount} from 'svelte';
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import {spring} from 'svelte/motion';
  import HamsterLoader from "$lib/components/loaders/HamsterLoader.svelte";

  dayjs.extend(duration);

  // EXPORT
  export let data: number[] = [];
  export let state: Rugbull.GameState = 'connecting';
  export let startTime: number;
  export let currentMultiplier: number = 1;
  export let debug = false;
  export let connected = false;

  // CONST
  const w = 600;
  const h = 500;
  const BLACK = '#070B11';
  const BRAND_COLOR = '#FFAE11';
  const WHITE = 'white';

  const CHART_LEFT = 10;
  const CHART_RIGHT = 50;
  const CHART_BOTTOM = 40;
  const CHART_TOP = 40;
  const CHART_H = h - CHART_BOTTOM - CHART_TOP;
  const CHART_W = w - CHART_LEFT - CHART_RIGHT;
  const BACKGROUND = loadImage('/images/rugbull/background.webp');

  // STATE
  let canvas: CanvasValue | undefined;
  let secondsToStart = Math.ceil((startTime - Date.now()) / 1000);
  let renderCount = 0;

  // REACTIVE STATE
  const X_MAX = spring(128);
  const MAX_MUL = spring(2);
  const BACKGROUND_Y = spring(200, {stiffness: 0.05, damping: 0.08, precision: 0.1});

  // MOUNT
  onMount(() => {
    const timeAnimation = createAnimationLoop(() => {
      if (state === 'waiting') {
        secondsToStart = Math.ceil((startTime - Date.now()) / 1000);
        if (secondsToStart < 0) {
          secondsToStart = 0;
        }
      }
    });
    timeAnimation.startLoop();
    return () => {
      timeAnimation.stopLoop();
    };
  });

  // FUNCTIONS
  function formatDuration(value: number) {
    return dayjs.duration(value).format('mm:ss');
  }

  function formatMultiplier(value: number) {
    return 'x' + value.toFixed(2);
  }

  function candlesFromData(data: number[], interval: number) {
    if (interval < 2) throw new Error('Interval must be greater than 1');
    if (data.length === 0) return [];
    const candles: Rugbull.ICandle[] = [];
    let i = 0;
    ///  except for the last one
    for (; i < data.length - interval; i += interval) {
      const open = i > 1 ? data[i-1] : 1.0;
      const close = data[i + interval - 1];
      candles.push({time: i, open, close});
    }

    /// add the last candle
    candles.push({time: i, open: i > 1 ? data[i-1] : 1.0, close: data[data.length - 1]});
    return candles;
  }

  function ceilPow2(value: number, min) {
    return Math.max(Math.pow(2, Math.ceil(Math.log2(value))), min);
  }

  function listYAxes(value: number) {
    const max = ceilPow2(value, 16);
    return [0, 1, max / 8, max / 4, max / 2, max];
  }

  // REACTIVE
  $: INTERVAL = 16;
  $: candles = candlesFromData(data, INTERVAL);

  $: {
    if (data.length > 128) {
      X_MAX.set(Math.ceil((data.length + 128) / 128) * 128);
    }
  }
  $: maxMul = Math.max(0, ...data);
  $: MAX_MUL.set(ceilPow2(maxMul, 2));

  $: {
    if (state === 'waiting' || state === 'connecting' || state === 'stopped') {
      BACKGROUND_Y.set(0)
    } else {
      BACKGROUND_Y.set(data.length * 2)
    }
  }

  // DRAW
  $: {
    if (canvas) {
      renderCount++;
      const {ctx, w: canvasW, density} = canvas;
      const scale = canvasW / w;
      const MIN_MUL = 0;
      const MUL_1 = 20;

      ctx.save();
      ctx.scale(density * scale, density * scale);
      ctx.fillStyle = BLACK;
      ctx.clearRect(0, 0, w, h);

      function yAt(v: number) {
        const at0 = h - CHART_BOTTOM;

        if (v < 1) {
          return at0 - (v / 1) * MUL_1;
        }

        const at1 = at0 - MUL_1;

        const MUL_H = $MAX_MUL - MIN_MUL;
        return at1 - ((v - MIN_MUL - 1) / MUL_H) * CHART_H;
      }

      function xAt(time: number) {
        return (time / $X_MAX) * CHART_W + CHART_LEFT;
      }

      function drawLine(x1, y1, x2, y2) {
        ctx.strokeStyle = BRAND_COLOR;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      function drawCurve(data: number[]) {
        ctx.strokeStyle = BRAND_COLOR;
        ctx.lineWidth = 1;
        ctx.moveTo(0, yAt(data[0]));
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
          ctx.lineTo(xAt(i), yAt(data[i]));
        }
        ctx.stroke();
      }

      function drawCandle(candle: Rugbull.ICandle, hollow: boolean) {
        const gap = 4;
        const h = yAt(candle.open) - yAt(candle.close);
        const w = xAt(INTERVAL - 1) - xAt(0);
        const x = xAt(candle.time);
        const negative = h >= 0;
        const yOffset = 0

        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#3A8FF4');
        gradient.addColorStop(1, '#28CCF0');
        const gradientRed = ctx.createLinearGradient(0, 0, 0, h);
        gradientRed.addColorStop(0, '#CF3362');
        gradientRed.addColorStop(1, '#FF6A97');

        ctx.save();
        ctx.strokeStyle = candle.close > candle.open ? gradient : gradientRed;
        ctx.lineWidth = 2;

        if (hollow) {
          ctx.fillStyle = 'transparent';
        } else {
          ctx.fillStyle = negative ? gradient : gradientRed;
        }
        ctx.beginPath();
        ctx.roundRect(x, yAt(candle.open) + yOffset, w, -h, 1);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      function drawTitles(texts: string[], options?: {
        fontSize: number,
      }) {
        ctx.save();
        ctx.translate(w / 2, h / 2 - 60);
        ctx.fillStyle = BRAND_COLOR;
        ctx.font = `bold ${options?.fontSize ?? 80}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < texts.length; i++) {
          ctx.fillText(texts[i], 0, 80 * i);
        }
        ctx.restore();
      }

      function drawCurrentPriceLine(mul: number, time: number) {
        ctx.save();
        ctx.strokeStyle = BRAND_COLOR
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])

        const y = yAt(mul)
        const candleW = xAt(INTERVAL - 1) - xAt(0)
        const x1 = xAt(time)
        const x2 = w - CHART_RIGHT

        ctx.beginPath()
        ctx.moveTo(x1 + candleW, y)
        ctx.lineTo(x2, y)
        ctx.stroke()

        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = BRAND_COLOR;
        ctx.translate(w - CHART_RIGHT + 4, yAt(mul));
        ctx.fillText(`${mul.toFixed(2)}`, 0, 0);

        ctx.restore();
      }

      function drawChartBox() {
        ctx.strokeStyle = WHITE;
        ctx.lineWidth = 1;
        ctx.strokeRect(CHART_LEFT, CHART_TOP, CHART_W, CHART_H);
      }

      function drawYAxis(values: number[]) {
        ctx.fillStyle = WHITE;

        function drawYLine(mul: number) {
          const y = yAt(mul);
          if (mul === 2) {
            ctx.strokeStyle = WHITE;
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
          }
          ctx.beginPath();
          ctx.moveTo(CHART_LEFT, y);
          ctx.lineTo(w - CHART_RIGHT, y);
          ctx.stroke();
        }

        function drawYLabel(mul: number) {
          ctx.save();
          ctx.font = '20px monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.translate(w - CHART_RIGHT + 10, yAt(mul));
          ctx.fillText('x' + mul, 0, 0);
          ctx.restore();
        }

        for (let i = 0; i < values.length; i++) {
          drawYLabel(values[i]);
          drawYLine(values[i]);
        }
      }

      // DRAW

      if ($BACKGROUND.image) {
        const {width, height} = $BACKGROUND;
        const takeH = (width / w) * h
        let takeY = height * 0.7 - $BACKGROUND_Y;
        takeY = Math.min(height - takeH, Math.max(0, takeY));
        ctx.drawImage($BACKGROUND.image, 0, takeY, width, takeH, 0, 0, w, h);
      }

      if (state === 'running' || state === 'stopped') {
        drawYAxis(listYAxes($MAX_MUL));

        // DRAW CANDLE
        for (let i = 0; i < candles.length; i++) {
          drawCandle(candles[i], state === 'running' && i === candles.length - 1);
        }

        drawCurrentPriceLine(state === 'stopped' ? 0 : currentMultiplier, candles[candles.length - 1].time)
      }

      // DRAW COUNTDOWN
      if (state === 'waiting') {
        drawTitles(['START IN', `${formatDuration(secondsToStart * 1000)}`]);
      }
      if (state === 'stopped') {
        drawTitles(['CRASHED']);
      }
      if (state === 'loading') {
        drawTitles(['LOADING']);
      }
      if (state === 'connecting') {
        drawTitles(['CONNECTING..'], {fontSize: 60});
      }
      if (state === 'reconnecting') {
        drawTitles(['RECONNECTING..'], {fontSize: 60});
      }

      ctx.restore();
    }
  }
</script>

{#if debug}
<pre>
  {state} render={renderCount} X_MAX={$X_MAX} MAX_MUL={$MAX_MUL}
</pre>
{/if}
<div class="game">
  <Canvas ratio={w / h} bind:value={canvas}/>
  <div class="overlay">
    <div class="connection-status" data-connected={connected}/>
    {#if state === 'running' || state === 'stopped'}
      <div class="multiplier">{formatMultiplier(currentMultiplier)}</div>
    {/if}
    {#if state === 'loading' || state === 'waiting'}
      <div class="loader">
        <HamsterLoader/>
      </div>
    {/if}
  </div>
</div>

<style>
  .game {
    position: relative;
  }

  .overlay {
    pointer-events: none;
  }

  .loader {
    position: absolute;
    bottom: 20px;
    left: 0;

    display: flex;
    width: 100%;
    justify-content: center;

    color: white;

    font-size: 2.333vw;
    @media (min-width: 600px) {
      font-size: 14px;
    }
  }

  .connection-status {
    position: absolute;
    top: 20px;
    right: 20px;

    border-radius: 50%;
    background-color: red;
    width: 4vw;
    height: 4vw;

    &[data-connected=true]{
      background-color: greenyellow;
    }
    @media (min-width: 600px) {
      width: 24px;
      height: 24px;
    }
  }

  .multiplier {
    position: absolute;

    color: white;
    font-family: monospace;
    font-weight: 600;

    padding: 12px 20px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 8px;

    top: 3.3vw;
    left: 3.3vw;
    font-size: 5.3vw;
    @media (min-width: 600px) {
      top: 20px;
      left: 20px;
      font-size: 32px;
    }
  }
</style>
