<script context="module" lang="ts">
  import {writable} from "svelte/store";
  import {browser} from "$app/environment";


  interface Setting {
    auto: boolean,
    cashoutMultiplier: number,
    betAmount: number,
  }

  function createStore(id: string) {
    const init = {
      auto: true,
      cashoutMultiplier: 1.01,
      betAmount: 50,
      ...JSON.parse(browser && localStorage.getItem(id))
    }
    const store = writable<Setting>(init);

    store.subscribe((value) => {
      browser && localStorage.setItem(id, JSON.stringify(value))
    })

    return store;
  }

  export function getSetting(id: string): Setting {
    return JSON.parse(browser && localStorage.getItem(id))
  }
</script>

<script>
  import BetButton from "./BetButton.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import {createEventDispatcher, onMount} from 'svelte';
  import EyeLoader from "$lib/components/loaders/EyeLoader.svelte";
  import TopModal from "$lib/components/modals/TopModal.svelte";
  import SimpleCheckbox from "$lib/components/input/SimpleCheckbox.svelte";
  import CashoutInput from "$lib/components/input/CashoutInput.svelte";
  import BetAmountInput from "$lib/components/input/BetAmountInput.svelte";
  import BetModuleLayout from "./BetModuleLayout.svelte";

  export let id = 'setting-1'
  export let label = 'Bet 1';
  export let available = 1000;
  export let minBet = 50;
  export let showCashout = true;
  export let currentMultiplier = 1.2;
  export let gameState = "waiting";
  export let coinType = 1;

  const setting = createStore(id);
  let open = false;

  $: ({auto, cashoutMultiplier, betAmount} = $setting)

  const dispatch = createEventDispatcher();

  function showSetting() {
    if (!showCashout) {
      open = true;
    }
  }


  $: canCashout = !auto && showCashout && gameState === "running"
  $: canBet = gameState === "waiting" && !showCashout
</script>

<BetModuleLayout>
  <button slot="left" class="left p-1" on:click={showSetting}
          class:disabled={!canBet}
          class:auto={auto}
  >
        <span>{auto ? "Auto Cashout" : "Manual"}<br/>
          {#if auto}x{cashoutMultiplier.toPrecision(3)}{/if}</span>
  </button>
  <button slot="right" class="right p-1"
          class:disabled={!canBet}
          on:click={showSetting}>
    <span>Amount<br/>${betAmount.toFixed(2)}</span>
  </button>
  <button slot="bottom"
          class="cashout-text"
          class:cashout-text-active={showCashout}
          on:click={showSetting}>
    {#if showCashout}
      <span>${(betAmount * currentMultiplier).toFixed(2)}</span>
    {:else if gameState === "waiting" && coinType === 1}
      <img alt="coin" src="/images/user/energy.svg"/>
    {:else if gameState === "waiting" && coinType === 2}
      <img alt="coin" src="/images/user/coin.svg"/>
    {/if}
  </button>
  <div slot="button">
    <BetButton
        on:click={() => dispatch('bet')}
        disabled={!canBet && !canCashout}
        style="width: 100%; height: 100%"
    >
      {#if auto && showCashout }
        <div style="display: grid; justify-items: center">
          <EyeLoader style="font-size: 0.35px"/>
        </div>
      {:else}
        <span class="button-svg"> {showCashout ? 'Cashout' : 'Bet'} </span>
      {/if}
    </BetButton>
  </div>
</BetModuleLayout>

<TopModal bind:open>
  <div slot="body">
    <h2 style="text-align: left">{label}</h2>
    <div class="flex flex-col gap-4">
      <SimpleCheckbox id="auto-cashout" bind:checked={$setting.auto}/>
      <CashoutInput
          disabled={!$setting.auto}
          bind:value={$setting.cashoutMultiplier}/>
      <BetAmountInput
          max={available}
          min={minBet}
          bind:value={$setting.betAmount}
      />
      <ActionButton on:click={() => open = false}>OK</ActionButton>
    </div>
  </div>

</TopModal>

<style lang="scss">
  .disabled {
    color: var(--text-gray)
  }

  .auto {
    font-weight: 600;
  }

  .cashout-text {
    font-weight: 600;
    font-size: 1.2rem;
  }

  .cashout-text-active {
    background-color: var(--brand);
    color: var(--brand-text);
  }


  .bet-module-container {
    grid-template-columns: 1fr 60px;

    .button-svg {
      font-size: 15px;
      writing-mode: vertical-rl;
      line-height: 0;
      margin: 0 12px;
    }

    @media (min-width: 470px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 60px;
      .button-loader {
        min-height: 40px;
      }
      .button-svg {
        font-size: 22px;
        writing-mode: unset;
      }
    }

  }


</style>