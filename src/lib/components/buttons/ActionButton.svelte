<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  function onClick () {
    dispatch('click')
  }
</script>
<button on:click={onClick}>
  <slot/>
</button>

<style>
  button {
    background-color: var(--brand);
    font-size: 20px;
    font-weight: 600;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--brand-hover);
  }

  button:active {
    background-color: var(--brand-hover);
  }
</style>