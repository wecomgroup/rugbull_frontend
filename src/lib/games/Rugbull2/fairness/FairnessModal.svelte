<script lang="ts">
  import { type Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import { socketStore } from "$lib/stores/socket";
  import FairnessVerification from "./FairnessVerification.svelte";
  import BottomModal from "$lib/components/modals/BottomModal.svelte";

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

  function createSocketHandler<T>(callback: (data: T) => void) {
    return (err, event: any) => {
      if (checkError(err, event)) {
        return;
      }
      if (event.statusCode === 200) {
        const data: T = event.data;
        callback(data);
      } else {
        console.log("UNHANDLED EVENT", event);
      }
    };
  }

  /// INIT
  function initSocketOnMount() {
    const { socket } = socketStore;

    socket.on("connect", () => {
      getGameResults(socket);
      getWebConfig(socket);
    });

    return socket;
  }

  /// API
  function getGameResults(socket: Socket) {
    socket.timeout(5000).emit(
      "/v1/games.php/result",
      {
        limit: 20,
        page: 1,
      },
      createSocketHandler<RugbullAPI.ResultEvent>((event) => {
        console.log("RESULTS", event);
        resultsHistory = event.rows.map((i) => ({
          round: i.round,
          encryption: i.encryption,
        }));
      }),
    );
  }

  function getWebConfig(socket: Socket) {
    socket.timeout(5000).emit(
      "/v1/index.php/webconfig",
      {},
      createSocketHandler<RugbullAPI.WebConfigEvent>((event) => {
        clientSeed = event.clientSeed;
      }),
    );
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
