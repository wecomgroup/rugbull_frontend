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

  export function getSetting(id: string) : Setting {
    return JSON.parse(browser && localStorage.getItem(id))
  }
</script>

<script>
  import BetButton from "$lib/components/BetController/BetButton.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";
  import SettingsIcon from "$lib/icons/SettingsIcon.svelte";
  import BetModuleAmount from "$lib/components/BetController/BetModuleAmount.svelte";
  import BetModuleCashout from "$lib/components/BetController/BetModuleCashout.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Modal from "$lib/components/Modal/Modal.svelte";
  import {createEventDispatcher, onMount} from 'svelte';
  import EyeLoader from "$lib/components/loaders/EyeLoader.svelte";

  export let id = 'setting-1'
  export let label = 'Bet 1';
  export let available = 1000;
  export let minBet = 50;
  export let showCashout = true;
  export let currentMultiplier = 1.2;

  const setting = createStore(id);
  let open = false;

  $: ({auto, cashoutMultiplier, betAmount} = $setting)

  const dispatch = createEventDispatcher();

  function onSettings() {
    if (!showCashout) {
      open = true;
    }
  }


</script>

<div class="bet-module-container">
  <button style="padding: 0; display: grid; align-items: stretch" on:click={onSettings}>
    <ContainerV2 style="display: flex; gap: 8px; align-items: center; justify-content: center">
      <div style="display:grid; gap: 4px; grid-template-columns: 1fr 1fr">
        <span class="tag" class:disabled={!auto}>Auto Cashout<br/>
          {#if auto}x{cashoutMultiplier}{/if}</span>
        <span class="tag">Bet Amount<br/>${betAmount.toFixed(2)}</span>
        <span class="tag highlight" class:hide-value={!showCashout} class:disabled={!showCashout}
              style="grid-column: 1/3">Cashout ${(betAmount * currentMultiplier).toFixed(2)}</span>
      </div>


      <div class:disabled={showCashout}>
        <SettingsIcon/>
      </div>
    </ContainerV2>
  </button>
  <BetButton
      on:click={() => dispatch('bet')}
      disabled={auto && showCashout}
      size="sm">
    {#if auto && showCashout }
      <div style="display: grid; justify-items: center">
        <EyeLoader style="font-size: 0.35px"/>
      </div>
    {:else}
      <span class="button-text"> {showCashout ? 'Cashout' : 'Bet'} </span>
    {/if}
  </BetButton>
</div>

<Modal showCloseIcon={true} bind:open>
  <div slot="title">{label}</div>
  <div slot="body" style="display: flex; flex-direction: column; gap: 8px">
    <BetModuleCashout
        bind:checked={$setting.auto}
        bind:value={$setting.cashoutMultiplier}
    />
    <BetModuleAmount
        max={available}
        min={minBet}
        bind:value={$setting.betAmount}
    />
    <ActionButton on:click={() => open = false}>Close</ActionButton>
  </div>

</Modal>

<style lang="scss">
  .bet-module-container {
    display: grid;
    grid-template-columns: 1fr 60px;
    gap: 8px;

    .button-text {
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
      .button-text {
        font-size: 22px;
        writing-mode: unset;
      }
    }

  }

  .highlight {
    background-color: var(--brand);
    color: black;
    font-weight: 600;
  }

  .disabled {
    opacity: 0.5;
  }

  .hide-value {
    color: var(--brand);
  }

</style>