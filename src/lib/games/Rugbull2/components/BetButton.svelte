<script lang="ts">
  import {createEventDispatcher} from "svelte";

  export let disabled = false;
  export let style: string | undefined = undefined;
  export let loading: boolean | undefined = undefined;

  const dispatch = createEventDispatcher()

  function handler() {
    dispatch('click', {});
  }
</script>

<button
    class="BetButton"
    on:click={handler}
    {disabled}
    data-disabled={disabled?.toString()}
    data-loading={loading?.toString()}
    {style}>
  <slot/>
</button>

<style lang="scss">


  .BetButton {
    position: relative;
    cursor: pointer;
    background-image: var(--gradient1);
    //border: 2px solid transparent;

    &[data-disabled="true"] {
      pointer-events: none;
    }

    &[data-loading="true"] {
      pointer-events: none;
    }

    font-size: 1.5rem;
    font-weight: 500;

    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    color: white;
    transition: all 0.3s ease;

    &:disabled, &[disabled] {
      background-image: var(--background-2);
      color: var(--text-gray);
    }
    &:active {
      background-image: var(--gradient2);
    }
  }

</style>