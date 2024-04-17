<script lang="ts">
  import type {CanvasValue} from '$lib/components/Canvas';
  import {Canvas, createAnimationLoop, loadImage} from '$lib';
  import {onMount} from 'svelte';
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import type {ICandle, GameState} from './index';
  import {spring} from 'svelte/motion';
  import HamsterLoader from "$lib/components/loaders/HamsterLoader.svelte";


  dayjs.extend(duration);

  // EXPORT
  export let data: number[] = [];
  export let state: GameState = 'connecting';
  export let startTime: number;
  export let currentMultiplier: number = 1;
  export let history: number[] = [];
  export let debug = false;

  // STATE
  let canvas: CanvasValue | undefined;
  let secondsToStart = Math.ceil((startTime - Date.now()) / 1000);
  let renderCount = 0;

  const BACKGROUND = loadImage('/images/rugbull/background.webp');

  // CONST
  const w = 600;
  const h = 500;
  const BLACK = '#070B11';
  const BRAND_COLOR = '#FFAE11';
  const WHITE = 'white';

  const CHART_LEFT = 10;
  const CHART_RIGHT = 60;
  const CHART_BOTTOM = 40;
  const CHART_TOP = 40;
  const CHART_H = h - CHART_BOTTOM - CHART_TOP;
  const CHART_W = w - CHART_LEFT - CHART_RIGHT;

  // REACTIVE STATE
  const X_MAX = spring(128);
  const MAX_MUL = spring(2);
  const BACKGROUND_Y = spring(100, {stiffness: 0.05, damping: 0.08});

  // INTERVAL
  const timeAnimation = createAnimationLoop(({t, dt}) => {
    if (state === 'waiting') {
      secondsToStart = Math.ceil((startTime - Date.now()) / 1000);
      if (secondsToStart < 0) {
        secondsToStart = 0;
      }
    }
  });

  // MOUNT
  onMount(() => {
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
    const candles: ICandle[] = [];
    let i = 0;
    ///  except for the last one
    for (; i < data.length - interval; i += interval) {
      const open = data[i];
      const close = data[i + interval - 1];
      candles.push({time: i, open, close});
    }

    /// add the last candle
    candles.push({time: i, open: data[i], close: data[data.length - 1]});
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
  $: MAX_MUL.set(ceilPow2(currentMultiplier, 2));

  $: {
    if (state === 'waiting' || state === 'connecting' || state === 'stopped'){
      BACKGROUND_Y.set(0)
    }
    else {
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

      function xAt(index: number) {
        return (index / $X_MAX) * CHART_W + CHART_LEFT;
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

      function drawCandle(candle: ICandle, hollow: boolean) {
        const gap = 4;
        const h = yAt(candle.open) - yAt(candle.close);
        const w = xAt(INTERVAL - 1) - xAt(0);
        const x = xAt(candle.time);
        const negative = h > 0;
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

      function drawTitles(texts: string[]) {
        ctx.save();
        ctx.translate(w / 2, h / 2 - 80);
        ctx.fillStyle = BRAND_COLOR;
        ctx.font = 'bold 80px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < texts.length; i++) {
          ctx.fillText(texts[i], 0, 80 * i);
        }
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
        ctx.drawImage($BACKGROUND.image, 0, height * 0.7 - $BACKGROUND_Y, width, (width / w) * h, 0, 0, w, h);
      }

      if (state === 'running' || state === 'stopped' || state === 'waiting') {
        drawYAxis(listYAxes(currentMultiplier));

        // DRAW CANDLE
        for (let i = 0; i < candles.length; i++) {
          drawCandle(candles[i], state === 'running' && i === candles.length - 1);
        }
      }

      // DRAW COUNTDOWN
      if (state === 'waiting') {
        drawTitles(['START IN', `${formatDuration(secondsToStart * 1000)}`]);
      } else if (state === 'stopped') {
        drawTitles(['CRASHED']);
      } else if (state === 'loading') {
        drawTitles(['WAITING FOR', 'NEXT ROUND']);
      } else if (state === 'connecting') {
        drawTitles(['CONNECTING..']);
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
    {#if state === 'running' || state === 'stopped'}
      <div class="multiplier">{formatMultiplier(currentMultiplier)}</div>
    {:else if state === 'loading' || state === 'waiting'}
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
    font-size: 32px;
  }

  .multiplier {
    position: absolute;
    top: 20px;
    left: 20px;

    color: white;
    font-size: 32px;
    font-family: monospace;
    font-weight: 600;

    padding: 12px 20px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
  }
</style>
