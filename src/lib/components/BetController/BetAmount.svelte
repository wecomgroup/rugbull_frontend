<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import InputContainer from './InputContainer.svelte';

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
      dispatch('onChange', { value: value });
    }
  }
</script>

<InputContainer>
  {#if !lock}
    <div class="function-btns">
      <button class="button" on:click={() => (value = min)} {disabled}>{t('Min')}</button>
      <button class="button" on:click={() => (value = max)} {disabled}>{t('Max')}</button>
    </div>
  {/if}
  <div class="input-group">
    <div class="input-container">
      <span class="dolar-symbol">&#36;</span>
      <input class="input" {value} on:change={(e) => onChange(e)} />
    </div>
    {#if lock}
      <div style="color:#6f767e; font-size: 1.25rem; text-align:center; font-weight: 600">{t('Cash Out')}</div>
    {:else}
      <div style="color:#6f767e; font-size: 1.25rem; text-align:center; font-weight: 600">{max ? `$ ${max}` : ''}</div>
    {/if}
  </div>
  {#if !lock}
    <div class="function-btns">
      <button class="button" on:click={halving} {disabled}>1/2</button>
      <button class="button" on:click={double} {disabled}>2x</button>
    </div>
  {/if}
</InputContainer>

<style lang="scss">
  .function-btns {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .input-group {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .input-container {
      position: relative;
      padding-left: 4px;

      .input {
        color: black;
        width: 80px;
        font-size: 20px;
        font-weight: 700;
        outline: 2px solid transparent;
        outline-offset: 2px;
        text-align: center;
        padding-left: 16px;
        background-color: transparent;
        border-style: none;
      }
      .dolar-symbol {
        position: absolute;
        left: 0%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .button {
    cursor: pointer;
    transition: all 0.2s ease;
    color: black;
    padding: 0.25rem;
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

  @media (min-width: 768px) {
    .button {
      min-width: 28px;
      min-height: 24px;
    }

    .button-desktop {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
  }

  :global([data-theme='dark']) {
    .input-group {
      .input-container {
        .input {
          color: #d4d4d4;
        }
      }
    }

    .button {
      color: #d4d4d4;
      background: #2f3948;
      box-shadow: -1px -1px 4px 0px rgba(0, 0, 0, 0.5) inset, 2px 2px 4px 0px #3b4a60 inset, 0px 3px 3px 0px rgba(0, 0, 0, 0.25);
    }
  }
</style>
