<script>
  import {createEventDispatcher} from "svelte";

  export let iconFalse;
  export let iconTrue;
  export let selected = false;
  export let buttonOnly = false;

  const dispatch = createEventDispatcher();


</script>

<button
    class="grid items-center"
    on:click={() => {
      dispatch("click", {selected})
      if (!buttonOnly) {
        selected =!selected
      }
    }}
    data-selected="{selected}"
>
  <svelte:component this={selected ? iconTrue : iconFalse}/>
</button>

<style>
  button {
    background-color: transparent;
    color: #4F5168;
    border: 2px solid #333853;
    border-radius: 0.5rem;

    width: 2rem;
    height: 2rem;
    display: grid;
    padding: 2px;
  }

  button[data-selected=true] {
    background-color: #1E2233;
    color: #4F5168;
    border: 2px solid transparent;
  }
</style>