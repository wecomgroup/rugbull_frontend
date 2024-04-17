<script>
  import BetButton from "$lib/components/BetController/BetButton.svelte";
  import BetAmount from "$lib/components/BetController/BetAmount.svelte";
  import Cashout from "$lib/components/BetController/Cashout.svelte";
  import SimpleLoader from "$lib/components/loaders/SimpleLoader.svelte";
  import {createEventDispatcher} from "svelte";
  import {fly} from "svelte/transition";

  export let maxBet = 1000;
  export let betAmount = 10;
  export let cashoutMultiplier = 1.01;
  export let showCashout = false;
  export let loading = false;
  export let lock = false;
  export let auto = false;

  const maxCashout = 1000000;
  const minCashout = 1.01;
  let remainBets = null;

  const dispatch = createEventDispatcher();

  function t(v) {
    return v;
  }

  function onClick() {
    dispatch('click');
  }

  const flyY = {y: 20}
</script>

<div class="bet-controller">
  <div class="cashout">
    <Cashout bind:checked={auto} bind:value={cashoutMultiplier} {t} lock={showCashout || !auto}/>
  </div>
  {#if !showCashout}
    <div class="bet-group">
      <div class="bet-amount" in:fly={flyY}>
        <BetAmount bind:value={betAmount} max={maxBet} {t} lock={false}/>
      </div>
      <div style="min-width: 100px;" in:fly={flyY}>
        <BetButton size={'sm'}
                   loading={loading}
                   disabled={loading}
                   on:click={onClick}
                   style="height: calc(100% - 6px); width: 100%">
          {#if loading}
            <SimpleLoader variant="sm"/>
          {:else}
            <div class="bet-info">
              {#if showCashout}
                <span>{t('Cashout')}</span>
              {:else}
                <span>{t('Bet')}</span>
              {/if}
              {#if remainBets != null}
                <span style="font-size: 12px">{remainBets}</span>
              {/if}
            </div>
          {/if}
        </BetButton>
      </div>
    </div>

  {:else }
    <div in:fly={flyY} style="display: flex">
      <BetButton
          on:click={onClick}
          size={'sm'}
          style="min-height: 68px; flex:1">Cashout
      </BetButton>
    </div>
  {/if}

</div>

<style lang="scss">
  .bet-controller {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
    width: 100%;
    flex-direction: column;

    //@media (min-width: 530px) {
    //  flex-direction: row;
    //}
  }

  .bet-group {
    width: 100%;
    display: flex;
    gap: 0.5rem;
  }

  .bet-amount {
    flex: 1;
  }

  .bet-info {
    display: flex;
    flex-direction: column;
  }
</style>
