<script lang="ts">
  import {io, type Socket} from "socket.io-client";
  import {onMount} from "svelte";
  import FairnessVerification from "$lib/components/BetController/FairnessVerification.svelte";

  let errorMessage;
  let socket: Socket | undefined;
  let connected = false;
  let notLogin;
  let resultsHistory = []
  let clientSeed = undefined;


  /// COMMON FUNCTIONS
  function checkError(err, response) {
    if (err) {
      console.error(err)
      return true
    }
    if (response.ok === 0) {
      errorMessage = response.error;
      return true
    }
    if (response.output?.payload?.statusCode > 300) {
      errorMessage = response.output.payload.message;
      return true
    }
    return false;
  }

  function createSocketHandler<T>(callback: (data: T) => void) {
    return (err, event: any) => {
      if (checkError(err, event)) {
        return
      }
      if (event.statusCode === 200) {
        const data: T = event.data
        callback(data)
      } else {
        console.log('UNHANDLED EVENT', event)
      }
    }
  }

  /// INIT
  function initSocket({token}) {
    const socket = io('https://api.rugbull.io', {
      extraHeaders: {
        Authorization: token,
      },
    });
    socket.on('disconnect', () => {
      connected = false;
    });

    socket.on('connect', () => {
      connected = true;
      getGameResults(socket);
      getWebConfig(socket);
    });


    return socket;
  }


  /// API
  function getGameResults(socket: Socket) {
    socket
      .timeout(5000)
      .emit('/v1/games.php/result', {
        limit: 20,
        page: 1,
      }, createSocketHandler<RugbullAPI.ResultEvent>((event) => {
        console.log('RESULTS', event)
        resultsHistory = event.rows.map(i => ({
          round: i.round,
          encryption: i.encryption
        }))
      }))
  }

  function getWebConfig(socket: Socket) {
    socket
      .timeout(5000)
      .emit('/v1/index.php/webconfig', {},
        createSocketHandler<RugbullAPI.WebConfigEvent>(event => {
          clientSeed = event.clientSeed;
        }))
  }

  /// MOUNT
  onMount(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socket = initSocket({token});
    } else {
      notLogin = true;
    }
    return () => {
      socket?.disconnect();
    };
  });
</script>

<main>
  <h1>Provable Fairness</h1>
  <a href="/games/rugbull" style="color:var(--brand)">Back to game</a>
  <div style="margin-bottom: 32px"/>
  <FairnessVerification
      {clientSeed}
      results={resultsHistory}
  />
</main>
<style>
  main {
    padding: 16px;
  }
</style>