<script>
  import EnergyLine from "./EnergyLine.svelte";
  import {userStore} from "$lib/stores/_user.js";
  import {spring} from "svelte/motion";

  export let walletHref = undefined;

  const coinSpring = spring(0, {stiffness: 0.1});
  const {coin, energy} = userStore
  $: {
    coinSpring.set($coin);
  }
</script>

<div class="flex items-center gap-4">
  <EnergyLine
      energyMax={$energy.maxEnergy}
      energyAmount={$energy.current}
      coinAmount={$coinSpring}/>
  <a href={walletHref} class="wallet-button">
    <img alt="wallet" src="/images/user/wallet.svg"/>
  </a>
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