<script>
  import CopyableCode from "$lib/components/bet-controller/CopyableCode.svelte";
  import {hash, hashToNumber} from "$lib/games/Rugbull/decrypt.js";
  import {browser} from "$app/environment";
  import FieldLayout from "$lib/components/layout/FieldLayout.svelte";

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
  <CopyableCode id="client-seed" label="Client Seed" text={clientSeed ?? 'loading...'}/>
  <CopyableCode id="server-hash" label="Server Seed" text={serverHash ?? 'loading...'}/>

  <CopyableCode id="next-server-hash" label="Multiplier" text={multiplier}/>

  <CopyableCode id="previous-server-hash" label="Previous Server Seed" text={nextServerHash ?? 'loading...'}/>


  <h2 style="margin-top: 16px">Results History</h2>
  <div style="overflow: auto; height: 100px">
    <table class="table-primary" >
      <thead>
      <tr>
        <th>Round</th>
        <th>Encryption</th>
        <th>Multiplier</th>
      </tr>
      </thead>
      <tbody>
      {#each results as {round, encryption}}
        <tr>
          <td>{round}</td>
          <td>
            <button class="encryption" on:click={() => serverHash = encryption}>
              {encryption}
            </button>
          </td>
          <td style="text-align: right">{hashToNumber(encryption).toFixed(6)}</td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
</div>

<style>

  button {
    display: flex;
    align-items: center;
    gap: 8px;

    text-decoration: underline;
    color: var(--brand);
  }

  .encryption {
    word-break: break-all;
    text-align: left;
  }

  textarea {
    padding: 8px;
    color: black;
    font-size: 16px;
    border-radius: 6px;
  }

  td {
    font-family: monospace;
  }

</style>

