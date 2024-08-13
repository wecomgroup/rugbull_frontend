<script>
  import {spring} from 'svelte/motion';
  import {onMount} from "svelte";

  export let energyMax = 1500;
  export let energyAmount = 350;
  export let coinAmount = 5423.2392;

  const _start = spring(-20, {stiffness: 0.06})
  const _energyAmount = spring(0);

  $: _energyAmount.set(energyAmount);

  onMount(() => {
    _start.set(0);
  });

</script>

<div class="grid justify-items-end" style="gap: 2px">
  <div class="grid justify-items-end" style="overflow: hidden">
    <div class="flex items-center gap-1" style="transform: translate(0, {-$_start}px)">
      {energyAmount?.toFixed(2)} <span class="text-gray">/ {energyMax}</span>
      <img alt="coin" src="/images/user/energy.svg"/>
    </div>
  </div>
  <div class="line grid">
    <div class="line-background"/>
    <div class="line-fill" style="width: {$_energyAmount/energyMax * 100}%"/>
  </div>
  <div style="overflow: hidden">
    <div class="flex items-center gap-1"  style=" transform: translate(0, {$_start}px)" >
      {coinAmount.toPrecision(7)}
      <img alt="coin" src="/images/user/coin.svg"/>
    </div>
  </div>
</div>

<style lang="scss">

  .line {
    min-width: 10rem;

    & > * {
      grid-row: 1;
      grid-column: 1;
      height: .25rem;
      border-radius: .5rem;
    }

    .line-fill {
      background-color: var(--brand);
    }

    .line-background {
      background-color: var(--gray);
    }
  }

  .text-gray {
    font-weight: normal;
    color: var(--text-gray);
  }
</style>
