<script>
  import {createEventDispatcher} from "svelte";

  export let icon;

  const dispatch = createEventDispatcher();

  function onClick () {
    dispatch('click');
  }
</script>

<button
    class="grid items-center"
    on:click={onClick}
>
  <svelte:component this={icon}/>
</button>

<style>
  button {
    background-color: #202539;
    color: #4F5168;
    border: 2px solid #24273A;
    border-radius: 0.5rem;

    width: 2rem;
    height: 2rem;
    display: grid;
    padding: 2px;

  }
</style>