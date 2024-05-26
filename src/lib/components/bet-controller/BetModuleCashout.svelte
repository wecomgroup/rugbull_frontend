<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import PrimaryContainer from './PrimaryContainer.svelte';
  import SimpleCheckbox from "$lib/components/buttons/SimpleCheckbox.svelte";
  import {fly} from 'svelte/transition';
  import ContainerV2 from "$lib/components/bet-controller/ContainerV2.svelte";

  export let checked: boolean = false;
  export let disabled = false;
  export let value: number = 1.01;
  export let t: (v) => void = (a) => a;
  export let min: number = 1.01;
  export let max: number = 100;

  const dispatch = createEventDispatcher();

  const minmax = (value: number) => {
    if (typeof value !== 'number' && !value) {
      return min;
    }
    return Math.min(max, Math.max(min, value));
  };

  function increase() {
    value = minmax(value + 1);
  }

  function decrease() {
    value = minmax(value - 1);
  }

  $: {
    if (value) {
      dispatch('onChange', {value: value});
    }
  }
</script>

<div style="display: flex; gap: 8px">
  <ContainerV2 style="flex: 1; display: grid; align-items: center;">
    <SimpleCheckbox bind:checked label={t('Auto Cash Out')}/>
  </ContainerV2>
  {#if checked}
    <div in:fly={{x:20}}>

      <ContainerV2>
        <div style="display: flex; margin: auto; gap:4px">
          <div class="input-group">
            <div class="input-container">
              <span style="font-weight: 700; font-family: monospace; font-size: 20px">x</span>
              <input type="number" class="input" bind:value/>
            </div>
          </div>
          <button class="button" on:click={decrease} {disabled}>-</button>
          <button class="button" on:click={increase} {disabled}>+</button>
        </div>
      </ContainerV2>
    </div>
  {/if}
</div>

<style lang="scss">
  .input-group {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

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
        text-align: left;
        background-color: transparent;
        border: 1px solid currentColor;
        padding-left: 4px;
      }

    }
  }

  .button {
    padding: 4px 8px;
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
