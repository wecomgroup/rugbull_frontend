<script>
  import RugbullController from "$lib/games/Rugbull/RugbullController.svelte";
  export let data;
</script>

<RugbullController token={data.token}/>