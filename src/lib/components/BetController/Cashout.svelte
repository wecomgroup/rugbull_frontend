<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import InputContainer from './InputContainer.svelte';

  export let size: 'xs' | 'sm' | 'md' = 'md';
  export let disabled = false;
  export let style: string | undefined = undefined;
  export let value: number = 1.01;
  export let t: (v) => void = (a) => a;
  export let min: number = 1.01;
  export let max: number = 10;
  export let lock: boolean = false;

  const dispatch = createEventDispatcher();

  const minmax = (value: number) => {
    if (typeof value !== 'number' && !value) {
      return min;
    }
    return Math.min(max, Math.max(min, value));
  };

  function onChange(e: any) {
    value = parseInt(e?.target?.value || 0);
    if (value <= 0) {
      value = 10;
    }
  }

  function increase() {
    value = minmax(value + 1);
  }

  function decrease() {
    value = minmax(value - 1);
  }

  $: {
    if (value) {
      dispatch('onChange', { value: value });
    }
  }
</script>

<InputContainer>
  {#if !lock}
    <button class="button mobile" on:click={decrease} {disabled}>-</button>
  {/if}
  <div class="input-group">
    <div class="input-container">
      <input class="input" {value} on:change={(e) => onChange(e)} />
      <div style="text-align: center">{t('Cash Out')}</div>
    </div>
  </div>
  {#if !lock}
    <div class="button-desktop">
      <button class="button" on:click={increase} {disabled}>+</button>
      <button class="button" on:click={decrease} {disabled}>-</button>
    </div>
    <button class="button mobile" on:click={decrease} {disabled}>-</button>
  {/if}
</InputContainer>

<style lang="scss">
  .input-group {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .input-container {
      position: relative;
      padding-left: 4px;
      display: flex;
      flex-direction: column;
      justify-content: center;

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
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .button {
    cursor: pointer;
    transition: all 0.2s ease;
    color: black;
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

  .button-desktop {
    display: none;
  }
  @media (min-width: 768px) {
    .mobile {
      display: none;
    }

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
