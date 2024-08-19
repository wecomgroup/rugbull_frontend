<script lang="ts">
  import { onMount } from "svelte";
  import FairnessVerification from "$lib/components/bet-controller/FairnessVerification.svelte";
  import { GameAPI } from "$lib/socket-api/game";

  let resultsHistory = [];
  let clientSeed = undefined;

  /// INIT
  function initSocket() {
    GameAPI.getGameResults().then((event) => {
      resultsHistory = event.rows.map((i) => ({
        round: i.round,
        encryption: i.encryption,
      }));
    });

    GameAPI.getWebConfig().then((event) => {
      clientSeed = event.clientSeed;
    });
  }

  /// MOUNT
  onMount(() => {
    initSocket();
  });
</script>

<main>
  <h1>Provable Fairness</h1>
  <a href="/games/rugbull" style="color:var(--brand)">Back to game</a>
  <div style="margin-bottom: 32px" />
  <FairnessVerification {clientSeed} results={resultsHistory} />
</main>

<style>
  main {
    padding: 16px;
    max-width: 720px;
    margin: 0 auto;
  }
</style>
