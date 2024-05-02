<script>
  import {spring} from 'svelte/motion';

  export let amount = 400;
  export let maxAmount = 1000;
  export let style = undefined;
  export let inactive = undefined;

  const amountS = spring(amount);
  $: amountS.set(amount);
</script>

<div class="energy-bar" style={style} data-inactive={inactive || undefined}>
  <div class="filler" style="width: {$amountS / maxAmount * 100}%">
    <div class="background"/>
  </div>
</div>

<style lang="scss">

  .energy-bar {
    --color: var(--brand);

    height: 2em;
    min-width: 100px;
    border-radius: 0.6em;
    border: 1px solid var(--color);
    overflow: hidden;

    &[data-inactive] {
      --color: var(--gray);
    }
  }

  .filler {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 600px;
    height: 2em;
    background: repeating-linear-gradient(-45deg, var(--color) 0 30px, #0000 0 40px) left/200% 100%;
    animation: i3 1s infinite linear;
  }

  @keyframes i3 {
    100% {
      /* =sin(45deg) * 40px  * 2 */
      transform: translate(-56.56px,0);
    }
  }
</style>