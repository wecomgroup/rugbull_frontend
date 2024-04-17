<script lang="ts">
  import type {GameState, ICandle, RoundEvent} from '$lib/games/Rugbull';
  import Rugbull from '$lib/games/Rugbull/Rugbull.svelte';
  import {io, type Socket} from 'socket.io-client';
  import {onMount} from 'svelte';
  import dayjs from "dayjs";
  import BetController from "$lib/components/BetController/BetController.svelte";
  import ShareLink from "$lib/components/ShareLink/ShareLink.svelte";
  import {hashToNumber} from './decrypt'

  /// PARAMS
  export let token;

  /// STATE
  let chart = [];
  let startTime = null;
  let state: GameState = 'connecting';
  let connectionLost = false;
  let multiplier = 1;
  let history = []

  /// SOCKET
  let socket: undefined | Socket

  /// FUNCTIONS
  function formatTime(v) {
    return dayjs(v).format('HH:mm:ss');
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
      } = response.data;

      if (data.status === '1') {
        startTime = parseInt(data.startTime);
        state = 'waiting'
      } else {
        console.log('INIT', data)
      }
    });
  }

  function getResults(socket: Socket) {
    socket.timeout(5000).emit('/v1/games.php/result', {
      limit: 100,
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

  function initSocket() {
    const socket = io('https://api.rugbull.io', {
      extraHeaders: {
        Authorization: `${token}`,
      },
    });
    socket.on('disconnect', () => {
      console.log('DISCONNECTED', socket.connected);
      state = 'reconnecting';
    });

    socket.on('connect', () => {
      state = 'loading'
      getInfo(socket);
      getResults(socket);
    });
    socket.on('message', (e) => {
      const event: RoundEvent = JSON.parse(e);
      if (event.status === 1) {
        startTime = event.startTime;
        state = 'waiting';
        chart = [];
      } else if (event.status === 2) {
        chart = [...chart, event.multiplier];
        multiplier = event.multiplier;

        state = 'running';
      } else if (event.status === 3) {
        history = [ event.multiplier, ...history];
        chart = [...chart, 0];
        if (state !== 'loading') {
          state = 'stopped';
        }
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

  function handleBet() {
  }

</script>

<main>
  <Rugbull {startTime} {state} data={chart} currentMultiplier={multiplier} {history}/>
  <div class="history-row">
    {#each history as i}
      <div class="history-row-item" data-variant={i > 10 ? 'brand' : ''}>{i < 10 ? i.toFixed(2) : i.toFixed(0)}</div>
    {/each}
    <div class="overlay"/>
  </div>
  <BetController on:bet={handleBet}/>
  <ShareLink/>
</main>

<style lang="scss">
  main {
    max-width: 600px;
    gap: 8px;
    display: grid;
    margin: 0px auto 32px auto;
    padding: 16px;
  }

  .history-row {
    display: flex;
    overflow: auto;
    gap: 4px;
    position: relative;

    .history-row-item {
      padding: 4px 8px;
      background-color: #3b4a60;

      &[data-variant=brand] {
        background-color: var(--brand);
        color: black;
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
  }

</style>