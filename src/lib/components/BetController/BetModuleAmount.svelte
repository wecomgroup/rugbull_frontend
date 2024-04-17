<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import PrimaryContainer from './PrimaryContainer.svelte';
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";

  export let size: 'xs' | 'sm' | 'md' = 'md';
  export let disabled = false;
  export let style: string | undefined = undefined;
  export let max: number = 10;
  export let min: number = 1;
  export let value: number = 10;
  export let t: (v) => void = (a) => a;
  export let lock: boolean = false;

  const dispatch = createEventDispatcher();

  function onChange(e: any) {
    value = parseInt(e?.target?.value || 0);
    if (value <= 0) {
      value = 10;
    }
  }

  function minmax(x: number) {
    return Math.min(max, Math.max(min, x));
  }

  function halving() {
    value = minmax(Math.floor(value / 2));
  }

  function double() {
    value = minmax(value * 2);
  }

  $: {
    if (value) {
      dispatch('onChange', {value: value});
    }
  }
</script>

<ContainerV2 style="display: flex; flex-direction: column; gap: 8px">
  <div class="input-container">
    <span>Bet amount: </span>
    <span class="dolar-symbol">&#36;</span>
    <input type="number" class="input" {value} on:change={(e) => onChange(e)}/>
  </div>
  <div style="color: var(--gray)">
    Available: <span>{max ? `$${max}` : ''}</span>
  </div>
  <div class="function-btns">
    <button class="button" on:click={() => (value = min)} {disabled}>{t('Min')}</button>
    <button class="button" on:click={() => (value = max)} {disabled}>{t('Max')}</button>
    <button class="button" on:click={halving} {disabled}>1/2</button>
    <button class="button" on:click={double} {disabled}>2x</button>
  </div>
</ContainerV2>

<style lang="scss">
  .function-btns {
    display: flex;
    margin: auto;
    gap: 8px;
  }

  .input-container {
    .dolar-symbol {
    }

    .input {
      color: black;
      width: 80px;
      font-size: 32px;
      font-weight: 700;
      outline: 2px solid transparent;
      outline-offset: 2px;
      background-color: transparent;
      padding-left: 8px;
      min-width: 100px;
      border: 1px solid currentColor;
    }
  }

  .button {
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.5rem;
    background: #d4d4d4;
    border-radius: 4.733px;
    box-shadow: -1.104px -1.104px 4.41px 0px rgba(0, 0, 0, 0.5) inset, 2.208695888519287px 2.208695888519287px 4.417391777038574px 0px #d4d4d4 inset,
    0px 3.3130438327789307px 3.3130438327789307px 0px rgba(255, 255, 255, 0.25);

    &:hover {
      transform: translate(0, -1px);
    }

    &:active {
      transform: translate(0, 2px);
      border-radius: 4.286px;
      background: #eee;
      box-shadow: -1px -1px 4px 0px rgba(0, 0, 0, 0.5) inset, 1px 1px 4px 0px #000 inset;
    }
  }

  :global([data-theme='dark']) {
    .input {
      color: #d4d4d4;
    }

    .button {
      color: #d4d4d4;
      background: #2f3948;
      box-shadow: -1px -1px 4px 0px rgba(0, 0, 0, 0.5) inset, 2px 2px 4px 0px #3b4a60 inset, 0px 3px 3px 0px rgba(0, 0, 0, 0.25);
    }
  }
</style>
