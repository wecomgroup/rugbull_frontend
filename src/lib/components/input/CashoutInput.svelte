<script>
  import InputLayout from "$lib/components/input/InputLayout.svelte";

  export let id = "cashout";
  export let label = "Cashout at";
  export let placeholder = "Enter cashout"
  export let quickValues = ["2x", "2.5x", "3x"]
  export let value = 1.01
  export let min = 1.01
  export let max = 1000
  export let disabled = false;

  function quickValue(x) {
    value = parseFloat(x.replaceAll('x', ''))
    value = Math.max(min, Math.min(max, value));
  }

  function onBlur() {
    value = Math.max(min, Math.min(max, value));
  }

</script>

<InputLayout {id} {label}>
  <div slot="input">
    <input id={id}
           {disabled}
           data-disabled={disabled}
           bind:value
           type="number"
           on:blur={onBlur}
           {placeholder}/>
  </div>
  <div slot="buttons" class="flex gap-2">
    {#each quickValues as it}
      <button class="rounded-2"
              {disabled}
              data-disabled={disabled}
              on:click={() => quickValue(it)}
      >{it}</button>
    {/each}
  </div>
</InputLayout>

<style lang="scss">
</style>