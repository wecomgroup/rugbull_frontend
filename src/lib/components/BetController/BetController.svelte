<script>
  import BetButton from "$lib/components/BetController/BetButton.svelte";
  import BetAmount from "$lib/components/BetController/BetAmount.svelte";
  import Cashout from "$lib/components/BetController/Cashout.svelte";
  import SimpleLoader from "$lib/components/loaders/SimpleLoader.svelte";
  import {createEventDispatcher} from "svelte";

  let betMax = 1000;
  let betAmount = 10;
  let cashout = 10;
  let lockbet = false;
  let disableBetButton = false;
  let remainBets = 1;

  const dispatch = createEventDispatcher();

  function t(v) {
    return v;
  }

  function triggerBet(){
    dispatch('bet', {betAmount, cashout});
  }
</script>

<div class="bet-controller">
  <div class="cashout">
    <Cashout bind:value={cashout} {t} lock={lockbet}/>
  </div>
  <div class="bet-group">
    <div class="bet-amount">
      <BetAmount bind:value={betAmount} max={betMax} {t} lock={false}/>
    </div>
    <div class="bet-btn">
      <BetButton size={'sm'} loading={disableBetButton} disabled={disableBetButton} on:click={triggerBet}
                 style="height: calc(100% - 6px); width: 100%">
        {#if disableBetButton}
          <SimpleLoader variant="sm"/>
        {:else}
          <div class="bet-info">
            <span>{t('Bet')}</span>
            <span style="font-size: 12px">{remainBets > 0 ? `(${remainBets})` : ''}</span>
          </div>
        {/if}
      </BetButton>
    </div>
  </div>
</div>

<style lang="scss">
  .bet-controller {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
    width: 100%;
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row;
    }
  }

  .bet-group {
    width: 100%;
    display: flex;
    gap: 0.5rem;
  }

  .bet-amount {
    flex: 1;
  }

  .bet-btn {
    transform: translateY(4px);
    min-width: 100px;
  }

  .bet-info {
    display: flex;
    flex-direction: column;
  }
</style>
