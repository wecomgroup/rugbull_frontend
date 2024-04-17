<script lang="ts">
  import type {GameState, ICandle, RoundEvent} from '$lib/games/Rugbull';
  import Rugbull2 from '$lib/games/Rugbull/Rugbull2.svelte';
  import {io} from 'socket.io-client';
  import {onMount} from 'svelte';
  import dayjs from "dayjs";
  import BetController from "$lib/components/BetController/BetController.svelte";

  export let data;
  let chart = [0];
  let startTime = null;
  let state: GameState = 'connecting';
  let multiplier = 1;
  let history = [1.01, 2.18, 3.7, 8.5, 5.8, 1.01, 1.78734, 1.347682, 2.7634, 1.98734, 2.34873, 3.8745];

  function formatTime(v) {
    return dayjs(v).format('HH:mm:ss');
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
      state = 'loading'
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

        history = [...history.slice(0, history.length - 1), event.multiplier];

        if (state !== 'loading') {
          state = 'running';
        }
      } else if (event.status === 3) {
        history = [...history, 2];
        chart = [...chart, 0];
        if (state !== 'loading') {
          state = 'stopped';
        }
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
  <Rugbull2 {startTime} {state} data={chart} currentMultiplier={multiplier} {history}/>
  <BetController/>
</main>

<style>
  main {
    max-width: 600px;
    gap: 16px;
    display: grid;
    margin: 0px auto 32px auto;
  }

</style>