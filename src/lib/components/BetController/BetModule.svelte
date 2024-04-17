<script>
  import BetButton from "$lib/components/BetController/BetButton.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";
  import SettingsIcon from "$lib/icons/SettingsIcon.svelte";
  import BetModuleAmount from "$lib/components/BetController/BetModuleAmount.svelte";
  import BetModuleCashout from "$lib/components/BetController/BetModuleCashout.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Modal from "$lib/components/Modal/Modal.svelte";
  import {createEventDispatcher} from 'svelte';

  export let label = 'Bet 1';
  export let auto = true;
  export let cashoutMultiplier = 1.01;
  export let betAmount = 50;
  export let available = 1000;
  export let minBet = 50;
  export let showCashout = true;
  export let currentMultiplier = 1.2;

  let open = false;

  const dispatch = createEventDispatcher();

  function onSettings() {
    if (!showCashout) {
      open = true;
    }
  }
</script>

<div class="bet-module-container" style="">
  <button style="padding: 0" on:click={onSettings}>
    <ContainerV2 style="display: flex; gap: 8px; align-items: center">
      <div style="display:grid; gap: 4px; grid-template-columns: 1fr 1fr">
        <span class:disabled={!auto}>Auto Cashout<br/>
          {#if auto}x{cashoutMultiplier}{/if}</span>
        <span>Bet Amount<br/>${betAmount.toFixed(2)}</span>
        <span class:hide-value={!showCashout} class:disabled={!showCashout} class="highlight" style="grid-column: 1/3">Cashout ${(betAmount * currentMultiplier).toFixed(2)}</span>
      </div>


      <div class:disabled={showCashout}>
        <SettingsIcon/>
      </div>
    </ContainerV2>
  </button>
  <BetButton
      on:click={() => dispatch('bet')}
      style=" font-size: 18px"
      size="sm">{showCashout ? 'Cashout' : 'Bet'}</BetButton>
</div>

<Modal showCloseIcon={true} bind:open>
  <div slot="title">{label}</div>
  <div slot="body" style="display: flex; flex-direction: column; gap: 8px">
    <BetModuleCashout
        bind:checked={auto}
        bind:value={cashoutMultiplier}
    />
    <BetModuleAmount
        max={available}
        min={minBet}
        bind:value={betAmount}
    />
    <ActionButton on:click={() => open = false}>Close</ActionButton>
  </div>

</Modal>

<style>
  .bet-module-container {
    display: flex;
    gap: 8px;

    & > button:last-child {
      writing-mode: vertical-rl;
    }

    @media (min-width: 470px) {
      display: grid;
      & > button:last-child {
        writing-mode: unset;
      }
    }

  }

  span {
    background-color: #3b4a60;
    padding: 4px 8px;
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