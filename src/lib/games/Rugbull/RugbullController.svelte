<script lang="ts">
  import type {GameState, ICandle, RoundEvent} from '$lib/games/Rugbull';
  import Rugbull from '$lib/games/Rugbull/Rugbull.svelte';
  import {io, type Socket} from 'socket.io-client';
  import {onMount} from 'svelte';
  import dayjs from "dayjs";
  import BetController from "$lib/components/BetController/BetController.svelte";
  import ShareLink from "$lib/components/ShareLink/ShareLink.svelte";
  import {hashToNumber} from './decrypt'
  import {fly} from 'svelte/transition';
  import PrimaryContainer from "$lib/components/BetController/PrimaryContainer.svelte";
  import ErrorContainer from "$lib/components/BetController/ErrorContainer.svelte";

  /// PARAMS
  export let token;
  export let debug = false;

  /// STATE
  let chart = [];
  let startTime = null;
  let state: GameState = 'connecting';
  let connected = false;
  let multiplier = 1;
  let history = []
  let currentRound: string | null = null;
  let auto = false;
  let showCashout: boolean;
  let betAmount = 50;
  let cashoutMultiplier = 1.01;
  let messages: string[] = []
  let errorMessage: string | undefined;
  let recordId: string | undefined;
  let balance = 1000;

  /// SOCKET
  let socket: undefined | Socket

  /// REACTIVE
  $: {
    log(`> ROUND=${currentRound}`)
  }

  /// FUNCTIONS
  function log(message: string) {
    messages = [
      `${formatTimeMs(Date.now())} - ${message}`,
      ...messages,];
    if (messages.length > 200) {
      messages = messages.slice(0, 200);
    }
  }

  function formatTime(v) {
    return dayjs(v).format('HH:mm:ss');
  }

  function formatTimeMs(v) {
    return dayjs(v).format('HH:mm:ss.SSS');
  }

  function getInfo(socket: Socket) {
    socket.timeout(5000).emit('/v1/games.php/info', {}, (err, response) => {
      if (err) {
        console.error(err)
        return
      }

      const data: {
        status: string,
        multiplier: string;
        startTime: string;
        round: string,
      } = response.data;

      log(`[INFO] received ${data.status}`)

      if (data.status === '1') {
        startTime = parseInt(data.startTime);
        state = 'waiting'
        currentRound = data.round
      } else {
        console.log('INIT', data)
      }
    });
  }

  function getResults(socket: Socket) {
    socket.timeout(5000).emit('/v1/games.php/result', {
      limit: 20,
      page: 1,
    }, (err, response) => {
      const data: {
        encryption: string
        round: string
        updatedAt: string,
        multiplier: number,
      }[] = response.data.rows;
      data.forEach(i => {
        i.multiplier = hashToNumber(i.encryption)
      })

      history = data.map(i => i.multiplier)
    })
  }

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

  function postMakeBet(socket: Socket, params: {
    round: string,
    auto: boolean,
    multiplier: number,
    amount: number,
  }) {
    errorMessage = undefined;
    const payload = {
      round: params.round,
      coinType: 1,
      auto: params.auto ? 1 : 0,
      multiplier: params.multiplier,
      amount: params.amount,
    }

    console.log('BET', payload)

    socket.timeout(5000).emit('/v1/games.php/bet', payload, (err, response) => {
      console.log('BET RESPONSE', response)

      if (checkError(err, response)) {
        return
      }

      if (response.statusCode === 200) {
        showCashout = true;
        recordId = response.data.recordId;
        balance = response.data.new_balance;
      }

    });
  }

  function postCashOut(socket: Socket, params: {
    recordId: string,
  }) {
    const payload = {
      recordId: params.recordId,
    }
    console.log('CASHOUT', payload)

    socket.timeout(5000).emit('/v1/games.php/cashout', payload, (err, response) => {
      errorMessage = "";
      console.log('CASHOUT RESPONSE', response)

      if (checkError(err, response)) {
        return
      }

      if (response.statusCode === 200){
        console.log('CASHOUT RESPONSE', response)
        showCashout = false;
        recordId = undefined;
      }

    });
  }

  function initSocket() {
    const socket = io('https://api.rugbull.io', {
      extraHeaders: {
        Authorization: `${token}`,
      },
    });
    socket.on('disconnect', () => {
      connected = false;
      state = 'reconnecting';
    });

    socket.on('connect', () => {
      state = 'loading'
      connected = true;
      getInfo(socket);
      getResults(socket);
    });

    socket.on('gameEvent', (event: RoundEvent) => {
      if (event.status === 1) {
        startTime = event.startTime;
        state = 'waiting';
        chart = [];
        currentRound = event.round.toString()
        log(`[1] ROUND(${event.round}) starts=${formatTime(event.startTime)}`)
      } else if (event.status === 2) {
        chart = [...chart, event.multiplier];
        multiplier = event.multiplier;

        state = 'running';
        currentRound = event.round.toString()
        log(`[2] ${event.elapsed} ${event.multiplier.toFixed(2)}`)
      } else if (event.status === 3) {
        history = [event.multiplier, ...history];
        chart = [...chart, 0];
        if (state !== 'loading') {
          state = 'stopped';
        }
        currentRound = event.round.toString()
        log(`[3] stopped ${event.multiplier.toFixed(2)}`)
      }
    });


    return socket;
  }

  onMount(() => {
    socket = initSocket();
    return () => {
      socket.disconnect();
    };
  });

  /// HANDLERS
  function onBetOrCashout() {
    if (socket) {
      if (showCashout) {
        postCashOut(socket, {recordId});
      } else {
        postMakeBet(socket, {
          round: currentRound,
          auto,
          multiplier: cashoutMultiplier,
          amount: betAmount,
        });
      }
    }
  }

</script>

<main data-debug={debug}>
  {#if debug}
    <pre>round={currentRound} record={recordId}</pre>
  {/if}

  <Rugbull {startTime} {state} data={chart} currentMultiplier={multiplier} {connected}/>
  <div style="display: grid; position: relative;">
    <div class="history-row scrollbar-background">
      {#each history as i}
        <div in:fly={{x: -20}} class="history-row-item"
             data-variant={i > 10 ? 'brand' : ''}>{i < 10 ? i.toFixed(2) : i.toFixed(0)}</div>
      {/each}
    </div>
    <div class="overlay"/>
  </div>

  <BetController
      bind:betAmount
      bind:cashoutMultiplier
      bind:auto
      maxBet={balance}
      {showCashout}
      on:click={onBetOrCashout}/>
  {#if errorMessage}
    <div transition:fly={{y: -20}}
         on:click={() => errorMessage = undefined}
    >
      <ErrorContainer>
        {errorMessage}
      </ErrorContainer>
    </div>
  {/if}

  <ShareLink/>

  {#if debug}
    <div class="console">
    <pre>
      {#each messages as message}
       <p>{message}</p>
      {/each}
    </pre>
    </div>
  {/if}
</main>


<style lang="scss">
  main {
    max-width: 600px;
    gap: 8px;
    display: grid;
    margin: 0px auto 32px auto;
    padding: 16px;

    &[data-debug=true] {
      @media (min-width: 800px) {
        padding-right: 400px
      }
    }
  }

  .overlay {
    position: absolute;
    right: 0;
    top: 0;
    width: 200px;
    height: 100%;

    background: linear-gradient(to right, transparent, var(--background) 100%);
  }

  .history-row {
    display: flex;
    gap: 4px;
    overflow: auto;

    .history-row-item {
      padding: 4px 8px;
      background-color: #3b4a60;

      &[data-variant=brand] {
        background-color: var(--brand);
        color: black;
      }
    }

  }

  .console {
    position: fixed;
    top: 0;
    right: 0;

    max-height: 200px;
    width: 360px;
    overflow: auto;
    padding: 0 16px;

    pre {
      white-space: pre-wrap;
    }

    @media (min-width: 800px) {
      max-height: 600px;
    }
  }
</style>