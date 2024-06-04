<script>
  import BetModule from "$lib/games/Rugbull2/components/BetModule.svelte";
  import {createEventDispatcher} from "svelte";
  export let multiplier = 1;
  export let showCashout0 = false;
  export let showCashout1 = false;
  export let gameState = "waiting";
  export let coinType = 1;

  const dispatch = createEventDispatcher();
</script>
<div class="grid-with-2-columns items-stretch gap-2 m-2">
  <BetModule
      id="setting-0"
      label="Bet Setting 1"
      currentMultiplier={multiplier}
      showCashout={showCashout0}
      available={150}
      {gameState}
      {coinType}
      on:bet={ () => dispatch("action", 0)}
  />
  <BetModule
      id="setting-1"
      label="Bet Setting 2"
      available={150}
      currentMultiplier={multiplier}
      showCashout={showCashout1}
      {gameState}
      {coinType}
      on:bet={ () => dispatch("action", 1)}
  />
</div>
