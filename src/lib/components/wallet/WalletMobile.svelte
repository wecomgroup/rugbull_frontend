<script>
  import EnergyLine from "./EnergyLine.svelte";
  import {user} from "$lib/stores/_user.js";
  import {spring} from "svelte/motion";

  const coin = spring(0, {stiffness: 0.1});
  $: {
    coin.set($user.bonus);
  }
</script>

<div class="flex items-center gap-4">
  <EnergyLine
      energyMax={$user.maxEnergy}
      energyAmount={$user.energy}
      coinAmount={$coin}/>
  <button class="wallet-button">
    <img alt="wallet" src="/images/user/wallet.svg"/>
  </button>
</div>

<style lang="scss">
  .wallet-button {
    width: 40px;
    height: 40px;
    padding: 0;

    border-radius: 8px;
    background: var(--action);

    display: grid;
    justify-items: center;
    align-items: center;

    img {
      width: 30px;
    }
  }
</style>