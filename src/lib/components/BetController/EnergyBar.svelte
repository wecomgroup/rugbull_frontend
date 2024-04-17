<script>
  import {spring} from 'svelte/motion';

  export let amount = 400;
  export let maxAmount = 1000;

  const amountS = spring(amount);
  $: amountS.set(amount);
</script>

<div class="energy-bar">
  <div class="filler" style="width: {$amountS / maxAmount * 100}%">
    <div class="background"/>
  </div>
</div>

<style>
  .energy-bar {
    height: 2em;
    width: 160px;
    border-radius: 0.6em;
    border: 1px solid var(--brand);
    overflow: hidden;
  }

  .filler {
    height: 100%;
    overflow: hidden;
  }

  .background {
    width: 320px;
    height: 100%;
    background: repeating-linear-gradient(-45deg, var(--brand) 0 30px, #0000 0 40px) left/200% 100%;
    animation: i3 1s infinite linear;
  }

  @keyframes i3 {
    100% {
      /* =sin(45deg) * 40px  * 2 */
      transform: translate(-56.56px,0);
    }
  }
</style>