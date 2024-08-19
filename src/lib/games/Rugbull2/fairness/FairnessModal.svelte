<script lang="ts">
  import { onMount } from "svelte";
  import FairnessVerification from "./FairnessVerification.svelte";
  import BottomModal from "$lib/components/modals/BottomModal.svelte";
  import { GameAPI } from "$lib/socket-api/game";

  export let open = false;

  let resultsHistory = [];
  let clientSeed = undefined;

  /// COMMON FUNCTIONS
  function checkError(err, response) {
    if (err) {
      console.error(err);
      return true;
    }
    if (response.ok === 0) {
      return true;
    }
    if (response.output?.payload?.statusCode > 300) {
      return true;
    }
    return false;
  }

  /// INIT
  function initSocketOnMount() {
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
    initSocketOnMount();
  });
</script>

<BottomModal bind:open showCloseIcon={true} allowScroll={true}>
  <div slot="body" class="pt-4">
    <FairnessVerification {clientSeed} results={resultsHistory} />
  </div>
</BottomModal>

<style>
</style>
