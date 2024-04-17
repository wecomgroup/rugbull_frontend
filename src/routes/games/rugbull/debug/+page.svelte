<script lang="ts">
  import type {GameState, ICandle, RoundEvent} from '$lib/games/Rugbull';
  import Rugbull2 from '$lib/games/Rugbull/Rugbull2.svelte';
  import Rugbull from '$lib/games/Rugbull/Rugbull.svelte';
  import {io} from 'socket.io-client';
  import {onMount} from 'svelte';
  import dayjs from "dayjs";

  export let data;
  let chart = [];
  let startTime = null;
  let state: GameState = 'loading';
  let multiplier = 1;
  let history = [1.01, 2.18, 3.7, 8.5, 5.8, 1.01, 1.78734, 1.347682, 2.7634, 1.98734, 2.34873, 3.8745];
  let messages: string[] = []

  function log(message: string) {
    messages = [
      `${formatTimeMs(Date.now())} - ${message}`,
      ...messages,];
  }

  function formatTime(v) {
    return dayjs(v).format('HH:mm:ss');
  }

  function formatTimeMs(v) {
    return dayjs(v).format('HH:mm:ss.SSS');
  }

  function connectSocket() {
    const {token} = data;
    const socket = io('https://api.rugbull.io', {
      extraHeaders: {
        Authorization: `${token}`,
      },
    });

    socket.on('connect', () => {
      console.log('CONNECTED', socket.connected);
    });
    socket.on('message', (e) => {
      const event: RoundEvent = JSON.parse(e);
      if (event.status === 1) {
        startTime = event.startTime;
        state = 'waiting';
        chart = [];
        log(`1: ROUND(${event.round}) starts=${formatTime(event.startTime)}`)
      } else if (event.status === 2) {
        chart = [...chart, event.multiplier];
        multiplier = event.multiplier;

        history = [...history.slice(0, history.length - 1), event.multiplier];

        state = 'running';
        log(`2: ${event.elapsed} ${event.multiplier}`)
      } else if (event.status === 3) {
        history = [...history, 2];
        chart = [...chart, 0];
        if (state !== 'loading') {
          state = 'stopped';
        }
        log(`3: stopped`)
      }
    });
    socket.on('disconnect', () => {
      console.log('DISCONNECTED', socket.connected);
    });

    return () => {
      socket.disconnect();
    };
  }

  onMount(() => {
    const disconnect = connectSocket();
    return () => {
      disconnect();
    };
  });
</script>

<main>
  <pre>state={state}</pre>
  <Rugbull2 {startTime} {state} data={chart} currentMultiplier={multiplier} {history}/>
  <Rugbull {startTime} {state} data={chart} currentMultiplier={multiplier} {history}/>
</main>

<div class="console">
  <pre>
    {#each messages as message}
     <p>{message}</p>
    {/each}
  </pre>
</div>

<style>
  main {
    max-width: 600px;
    gap: 16px;
    display: grid;
    margin: 0px 400px 32px auto;
  }

  .console {
    position: fixed;
    top: 0;
    right: 0;

    max-height: 400px;
    width: 360px;
    overflow: auto;
    padding: 0 16px;
  }

  pre {
    max-width: 400px;
    white-space: break-spaces;
  }
</style>