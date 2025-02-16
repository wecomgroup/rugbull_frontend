<script lang="ts">
  import type { CanvasValue } from '$lib/components/Canvas';
  import {Canvas, createAnimationLoop, loadImage} from '$lib';
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import { spring } from 'svelte/motion';

  dayjs.extend(duration);

  // EXPORT
  export let data: number[] = [];
  export let state: Rugbull.GameState = 'loading';
  export let startTime: number;
  export let currentMultiplier: number = 1;
  export let history: number[] = [];

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
  const X_MAX = spring(50);

  // INTERVAL
  const timeAnimation = createAnimationLoop(({ t, dt }) => {
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

  function candlesFromData(data: number[], interval: number = 10) {
    const candles: Rugbull.ICandle[] = [];
    for (let i = 0; i < data.length - interval; i += interval) {
      const open = 2;
      const close = data[i + interval];
      candles.push({time: i, open, close });
    }
    return candles;
  }


  // REACTIVE
  $: candles = candlesFromData(history, 1);

  $: {
    if (data.length > 40) {
      X_MAX.set(Math.ceil((data.length + 40) / 40) * 40);
    }
  }

  // DRAW
  $: {
    if (canvas) {
      renderCount++;
      const { ctx, w: canvasW, density } = canvas;
      const scale = canvasW / w;
      const MIN_MUL = 0;
      const MUL_1 = 20;

      let MAX_MUL = 16;

      if (state !== 'waiting') {
        if (currentMultiplier < 4) {
          MAX_MUL = 16;
        } else {
          MAX_MUL = Math.ceil((currentMultiplier + 10) / 10) * 10;
        }
      }

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

        const MUL_H = MAX_MUL - MIN_MUL;
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
        ctx.lineWidth = 4;
        ctx.moveTo(0, yAt(data[0]));
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
          ctx.lineTo(xAt(i), yAt(data[i]));
        }
        ctx.stroke();
      }

      function drawCandle(index: number, candle: Rugbull.ICandle, hollow: boolean) {
        const gap = 4;
        const h = yAt(candle.open) - yAt(candle.close);
        const countMax = Math.max(20, candles.length + 1);
        const w = (CHART_W - countMax * gap) / countMax;
        const x = index * (w + gap) + CHART_LEFT;
        const negative = h > 0;
        const yOffset = negative ? -2 : 2;

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
        ctx.roundRect(x, yAt(candle.open) + yOffset, w, -h, 3);
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
        const { width, height } = $BACKGROUND;
        ctx.drawImage($BACKGROUND.image, 0, height * 0.7 - data.length * 2, width, (width / w) * h, 0, 0, w, h);
      }

      if (state === 'running' || state === 'stopped' || state === 'waiting' || state === 'loading') {
        drawYAxis([0, 1, 2, 4, 8, 16, 32, 64, 128, 256]);

        // DRAW CANDLE
        for (let i = 0; i < candles.length; i++) {
          drawCandle(i, candles[i], state === 'running' && i === candles.length - 1);
        }
      }
      if (state === 'running' || state === 'stopped') {
        // DRAW CURVE

        drawCurve(data);
      }

      // DRAW COUNTDOWN
      if (state === 'waiting') {
        drawTitles(['START IN', `${formatDuration(secondsToStart * 1000)}`]);
      } else if (state === 'stopped') {
        drawTitles(['CRASHED']);
      } else if (state === 'loading') {
        drawTitles(['WAITING FOR', 'NEXT ROUND']);
      }

      ctx.restore();
    }
  }
</script>

<div class="game">
  <Canvas ratio={w / h} bind:value={canvas} />
  <div class="overlay">
    {#if state === 'running' || state === 'stopped' || (state === 'loading' && currentMultiplier > 1)}
      <div class="multiplier-text">{formatMultiplier(currentMultiplier)}</div>
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

  .multiplier-text {
    position: absolute;
    color: white;
    font-size: 40px;
    top: 20px;
    left: 20px;
    font-family: monospace;
    font-weight: 600;

    padding: 12px 20px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
  }
</style>
