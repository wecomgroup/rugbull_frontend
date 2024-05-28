<script>
  import {createEventDispatcher} from "svelte";

  const dispatch = createEventDispatcher();
  function onClick () {
    dispatch("click");
  }
</script>
<button on:click={onClick}>
  <svg width="32" height="32"  viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.66663 16H28.3333M3.66663 7.66669H28.3333M3.66663 24.3334H15.3333"
          stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>

<style>
  button {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 8px;

    display: grid;
    align-items: center;
    justify-items: center;

    &:hover {
      background-color: var(--gray);
    }
  }
</style>
