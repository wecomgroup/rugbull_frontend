<script>
  import CopyableCode from "$lib/components/bet-controller/CopyableCode.svelte";
  import {hash, hashToNumber} from "$lib/games/Rugbull/decrypt.js";
  import {browser} from "$app/environment";
  import FieldLayout from "$lib/components/layout/FieldLayout.svelte";
  import ResultsHistory from "$lib/games/Rugbull2/fairness/ResultsHistory.svelte";

  export let clientSeed = undefined;
  let serverHash = undefined;
  export let round = undefined;
  export let results = [];
  let nextServerHash = undefined;
  let multiplier = 0;

  $: {
    if (browser && clientSeed && serverHash) {
      nextServerHash = hash(clientSeed, serverHash)
    }
  }
  $: {
    if (browser && serverHash) {
      multiplier = hashToNumber(serverHash)
      console.log('compute', serverHash, multiplier)
    }
  }
  $: {
    if (results.length > 0) {
      serverHash = results[0].encryption
    }
  }

  function onKeyDown(e) {
    console.log(e)
    if (!e.metaKey && !e.ctrlKey && isNaN(parseInt(e.key, 16))) {
      e.preventDefault()
    }
  }
</script>

<div class="modal-body">
  <CopyableCode id="next-server-hash" label="Multiplier" text={multiplier}/>
  <CopyableCode id="client-seed" label="Client Seed" text={clientSeed ?? 'loading...'}/>
  <CopyableCode id="server-hash" label="Server Seed" text={serverHash ?? 'loading...'}/>
  <CopyableCode id="previous-server-hash" label="Previous Server Seed" text={nextServerHash ?? 'loading...'}/>

  <div class="scrollbar-1" style="overflow: auto; height: 200px">
    <ResultsHistory {results}
                    on:click={e => serverHash = e.detail}
    />
  </div>
</div>

<style>

</style>

