<script>
  export let energyMax = 1500;
  export let energyAmount = 350;

</script>

<div id="energy-line">
  <div class="row">
    {energyAmount.toFixed(2)} <span class="text-gray">/ {energyMax}</span>
    <img alt="coin" src="/images/user/energy.svg"/>
  </div>
  <div id="line">
    <div id="line-background"/>
    <div id="line-fill" style="width: {energyAmount/energyMax * 100}%"/>
  </div>
</div>

<style lang="scss">
  #energy-line {
    display: grid;
    justify-items: flex-end;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  #line {
    display: grid;
    min-width: 140px;

    & > * {
      grid-row: 1;
      grid-column: 1;
      height: 4px;
      border-radius: 6px;
    }

    #line-fill {
      background-color: var(--brand);
    }

    #line-background {
      background-color: var(--gray);
    }
  }

  .text-gray {
    font-weight: normal;
    color: var(--text-gray);
  }
</style>
