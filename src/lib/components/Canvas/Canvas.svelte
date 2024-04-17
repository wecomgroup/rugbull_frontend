<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type { CanvasValue } from './Canvas.d.ts';

  const dispatch = createEventDispatcher();

  /// original w/h
  let width: number | undefined = undefined
  export let ratio: number = 400/300;

  export let density: number = 2;
  export let value: null | CanvasValue = null;

  let canvas: HTMLCanvasElement | undefined;

  let viewW = Math.floor(width);
  let viewH = width / ratio;

  let w = viewW * density;
  let h = viewH * density;


  onDestroy(() => {
    value = null;
  });

  $: {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      value = {
        ctx,
        w: width,
        h: Math.floor(width / ratio),
        density,
      };

      viewW = value.w;
      viewH = value.h;
      canvas.width = value.w * density;
      canvas.height = value.h * density;
    }
  }

  let clientHeight;
  $: componentH = Math.floor(width / ratio)
</script>

<div class="component" bind:clientWidth={width} bind:clientHeight style="height: {componentH}px" >
  <div class="canvas-container">
    <canvas
        width={w}
        height={h}
        bind:this={canvas}
        on:click={(e) =>
    dispatch('click', {
      x: e.offsetX,
      y: e.offsetY,
    })}
        on:keypress={(e) => dispatch('keypress', e)}
        style={`
    width: ${viewW}px;
    height: ${viewH}px;
  `}
    >
      <slot />
    </canvas>
  </div>
  <div class="debug">
    {width} {clientHeight} {componentH} {ratio.toFixed(2)}
  </div>
</div>

<style>
  .component {
      width: 100%;
      position: relative;
  }
  .debug {
      display: none;
      position: absolute;
      background: white;
      opacity: 0.5;
      padding: 4px;
  }
  .canvas-container {
      position: absolute;
      top: 0;
      left: 0;
  }
</style>
