<script>
  import EnergyLine from "./EnergyLine.svelte";

  export let energyMax = 1500;
  export let energyAmount = 350;
  export let coinAmount = 5423.2392;

</script>

<div class="flex items-center gap-4">
  <EnergyLine {energyMax} {energyAmount} {coinAmount}/>
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