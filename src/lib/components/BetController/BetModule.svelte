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
        <span class="tag" class:disabled={!auto}>Auto Cashout<br/>
          {#if auto}x{cashoutMultiplier}{/if}</span>
        <span class="tag">Bet Amount<br/>${betAmount.toFixed(2)}</span>
        <span class="tag highlight" class:hide-value={!showCashout} class:disabled={!showCashout} style="grid-column: 1/3">Cashout ${(betAmount * currentMultiplier).toFixed(2)}</span>
      </div>


      <div class:disabled={showCashout}>
        <SettingsIcon/>
      </div>
    </ContainerV2>
  </button>
  <BetButton
      on:click={() => dispatch('bet')}
      style=" font-size: 18px"
      size="sm">
    <span class="button-text"> {showCashout ? 'Cashout' : 'Bet'} </span>
  </BetButton>
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

<style lang="scss">
  .bet-module-container {
    display: flex;
    gap: 8px;

    .button-text {
      writing-mode: vertical-rl;
      line-height: 0;
      margin: 0 12px;
    }

    @media (min-width: 470px) {
      display: grid;
      .button-text {
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