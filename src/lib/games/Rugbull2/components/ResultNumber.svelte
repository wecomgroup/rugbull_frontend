<script>
  export let value = 1.2;

  $: level = value > 10 ? 4 : value > 5 ? 3 : value > 2 ? 2 : 1;

</script>

<div class="grid items-center px-2 rounded-2 level-{level}">{value}</div>

<style>
  div {
    font-weight: bold;
    color: #AF9BFF;
    background-color: #271D50;
  }

  .level-1 {
    color: #6CCAFF;
    background-color: #152C4F;
  }

  .level-2 {
    color: #6EE67A;
    background-color: #193612;
  }

  .level-3 {
    color: #E083F9;
    background-color: #572365;
  }

  .level-4 {
    color: #FFC040;
    background-color: #4C2A12;
  }
</style>