<script>
  import EnergyLine from "$lib/components/wallet/EnergyLine.svelte";

  export let energyMax = 1500;
  export let energyAmount = 350;
  export let coinAmount = 5423.2392;

</script>

<div id="wallet-mobile">
  <EnergyLine {energyMax} {energyAmount}/>
  <button id="wallet-button" style="grid-area: span 2 ">
    <img alt="wallet" src="/images/user/wallet.svg"/>
  </button>

  <div class="row" style="grid-area: 2">
    {coinAmount}
    <img alt="coin" src="/images/user/coin.svg"/>
  </div>
</div>

<style lang="scss">
  #wallet-mobile {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr 1fr;
    gap: 0 10px;

    font-weight: bold;
    font-size: 14px;

    align-items: center;
  }

  #wallet-button {
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

  .row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
  }
</style>