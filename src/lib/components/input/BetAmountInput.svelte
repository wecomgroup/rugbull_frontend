<script>
  import InputLayout from "$lib/components/input/InputLayout.svelte";

  export let id = "cashout";
  export let label = "Bet amount (max. 150)";
  export let min = 10;
  export let max = 150;
  export let placeholder = "Enter amount"
  export let quickValues = ["Min", "Max", "x2", "1/2"]
  export let value = 10;

  function quickValue(choice) {
    switch (choice) {
      case "Min":
        value = min;
        break;
      case "Max":
        value = max;
        break;
      case "x2":
        value = value * 2;
        break;
      case "1/2":
        value = value / 2;
        break;
    }
    value = Math.max(min, Math.min(max, value));
  }

  function onBlur() {
    value = Math.max(min, Math.min(max, value));
  }

</script>

<InputLayout {id} {label}>
  <div slot="input">
    <input id={id}
           bind:value
           on:blur={onBlur}
           type="number"
           {placeholder}/>
  </div>
  <div slot="buttons" class="flex gap-2">
    {#each quickValues as it}
      <button class="rounded-2"
              on:click={() => quickValue(it)}
      >{it}</button>
    {/each}
  </div>
</InputLayout>

<style lang="scss">
</style>