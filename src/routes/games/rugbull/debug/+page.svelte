<script>
  import RugbullController from "$lib/games/Rugbull/RugbullController.svelte";
  export let data;
</script>

<RugbullController
    debug={true}
    token={data.token}
/>