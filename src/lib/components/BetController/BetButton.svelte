<script lang="ts">
  import {createEventDispatcher} from "svelte";

  export let size : 'xs' | 'sm' | 'md'  = 'md';
  export let disabled = false;
  export let style : string | undefined = undefined;
  export let loading : boolean | undefined = undefined;

  const dispatch = createEventDispatcher()

  function handler() {
    dispatch('click', {});
  }
</script>

<button
    class="BetButton"
    on:click={handler}
    data-disabled={disabled?.toString()}
    data-loading={loading?.toString()}
    data-size={size} style={style}>
  <slot/>
</button>

<style lang="scss">
  $bc-green: #48B511;
  $bc-green-dark10: #{darken(#48B511, 10%)};
  $bc-green-dark20: #{darken(#48B511, 20%)};
  $bc-green-light10: #{lighten(#48B511, 10%)};

  .BetButton {
    cursor: pointer;
    background: $bc-green;
    border: 2px solid $bc-green-light10;

    &[data-disabled="true"] {
      opacity: 0.5;
      pointer-events: none;
    }

    &[data-loading="true"] {
      opacity: 0.5;
      pointer-events: none;
    }

    font-size: 22px;
    font-weight: bold;
    border-radius: 8px;
    color: white;
    transition: all 0.3s ease;
    margin-bottom: 8px;

    @media (min-width: 768px) {
      padding: 24px 40px;
    }


    transform: translate(0, -4px);
    box-shadow: 0px 6px 0px 0px $bc-green-dark10;
    &:hover {
      transform: translate(0, -6px);
      box-shadow: 0px 8px 0px 0px $bc-green-dark10;
    }

    &:active {
      transform: translate(0, 0px);
      box-shadow: 0px 2px 0px 0px $bc-green-dark10;
    }

    padding: 16px 16px;

    &[data-size="sm"] {
      padding: 8px 12px;
      border-radius: 8px;
    }

    &[data-size="xs"] {
      font-size: 16px;
      padding: 4px 8px;
      border-radius: 8px;
    }
  }
</style>