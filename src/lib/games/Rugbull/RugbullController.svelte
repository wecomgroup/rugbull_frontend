<script lang="ts">
  import Rugbull from '$lib/games/Rugbull/Rugbull.svelte';
  import {io, type Socket} from 'socket.io-client';
  import {onMount} from 'svelte';
  import dayjs from "dayjs";
  import ShareLink from "$lib/components/ShareLink/ShareLink.svelte";
  import {hashToNumber} from './decrypt'
  import {fly} from 'svelte/transition';
  import ErrorContainer from "$lib/components/BetController/ErrorContainer.svelte";
  import BetModule from "$lib/components/BetController/BetModule.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";
  import EnergyBar from "$lib/components/BetController/EnergyBar.svelte";
  import ZapIcon from "$lib/icons/ZapIcon.svelte";
  import CoinsIcon from "$lib/icons/CoinsIcon.svelte";
  import {spring} from "svelte/motion";
  import HistoryRow from "$lib/components/BetController/HistoryRow.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";

  /// PARAMS
  export let debug = false;

  /// TYPE
  interface Setting {
    auto: boolean;
    cashoutMultiplier: number;
    betAmount: number;
  }

  interface Record {
    id: string,
    auto: boolean,
    amount: number,
  }

  /// STATE
  let chart = [];
  let startTime = null;
  let state: Rugbull.GameState = 'connecting';
  let connected = false;
  let multiplier = 1;
  let multiplierHistory = []
  let betHistory: RugbullAPI.UserBet[] = []
  let currentRound: string | null = null;
  let messages: string[] = []
  let errorMessage: string | undefined;
  let setting1: Setting = {auto: false, cashoutMultiplier: 1.01, betAmount: 50};
  let setting2: Setting = {auto: true, cashoutMultiplier: 1.01, betAmount: 50};
  let record1: Record | undefined;
  let record2: Record | undefined;
  let energy = 0;
  let maxEnergy = 1000;
  let energyPerSecond = 1;
  let notLogin = false;
  const bonus = spring(0)

  /// SOCKET
  let socket: undefined | Socket

  /// REACTIVE
  $: {
    log(`> ROUND=${currentRound}`)
  }

  /// HANDLE STATE
  function updateFromInitEvent(event: RugbullAPI.InitEvent) {
    energyPerSecond = event.users_energy.energyAccumulationRate;
    maxEnergy = event.users_energy.energyCapacity;
    energy = Math.min(maxEnergy, Math.floor(-dayjs(event.users_energy.lastUpdateTime).diff() / 1000 * energyPerSecond + event.users_energy.currentEnergy))
    bonus.set(parseFloat(event.users_wallet.userBonus));
  }


  /// FUNCTIONS
  function log(message: string) {
    const formattedMessage = `${formatTimeMs(Date.now())} - ${message}`;
    if (!debug) {
      console.log(formattedMessage)
      return;
    }

    messages = [
      formattedMessage,
      ...messages,
    ];
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
        console.log('INFO', data)
      }
    });
  }

  function getResults(socket: Socket) {
    socket
      .timeout(5000)
      .emit('/v1/games.php/result', {
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
        multiplierHistory = data.map(i => i.multiplier)
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

  /// SOCKET HANDLERS
  function initSocket({token}) {
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

    // socket.on('init', (event: RugbullAPI.InitEvent) => {
    //   log(`[INIT] userId=${event.userId}`)
    //   console.log('EVENT init', event)
    //   updateFromInitEvent(event)
    // })

    socket.on('gameEvent', (event: Rugbull.RoundEvent) => {
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
        multiplierHistory = [event.multiplier, ...multiplierHistory];
        chart = [...chart, 0];
        if (state !== 'loading') {
          state = 'stopped';
        }
        multiplier = 1;
        currentRound = event.round.toString()
        record1 = undefined
        record2 = undefined
        log(`[3] stopped ${event.multiplier.toFixed(2)}`)
      }
    });

    socket.on('trumpetOfVictory', (event: any) => {
      console.log('EVENT trumpetOfVictory', event)
      if (event.recordId === record2?.id) {
        record2 = undefined;
      }
      if (event.recordId === record1?.id) {
        record1 = undefined;
      }
    })
    socket.on('balanceEvent', (event: any) => {
      console.log('EVENT balanceEvent', event)
      if (event.coinType === 1) {
        energy = event.currentEnergy;
      } else if (event.coinType === 2) {
        bonus.set(parseFloat(event.userBonus))
      }

    })


    return socket;
  }

  function postHistory(socket: Socket) {
    socket
      .timeout(5000)
      .emit('/v1/games.php/history', {}, createSocketHandler<RugbullAPI.HistoryEvent>(data => {
        console.log('HISTORY', data)
      }))
  }

  function postMakeBet(socket: Socket, index: number, setting: Setting) {
    errorMessage = undefined;
    const payload = {
      round: currentRound,
      coinType: 1,
      auto: setting.auto ? 1 : 0,
      multiplier: setting.cashoutMultiplier,
      amount: setting.betAmount,
    }

    console.log('BET', payload)

    socket
      .timeout(5000)
      .emit('/v1/games.php/bet', payload, (err, response) => {
        console.log('BET RESPONSE', response)

        if (checkError(err, response)) {
          return
        }

        if (response.statusCode === 200) {
          const record = {id: response.data.recordId, auto: setting.auto, amount: setting.betAmount};
          if (index === 0) {
            record1 = record;
          } else {
            record2 = record;
          }

          energy = response.data.new_balance;

          postInit(socket);
        }

      });
  }

  function postCashOut(socket: Socket, index: number, params: {
    recordId: string,
  }) {
    const payload = {
      recordId: params.recordId,
    }
    console.log('CASHOUT', payload)

    socket
      .timeout(5000)
      .emit('/v1/games.php/cashout', payload, (err, response) => {
        errorMessage = "";
        console.log('CASHOUT RESPONSE', response)

        if (checkError(err, response)) {
          return
        }

        if (response.statusCode === 200) {
          if (index === 0) {
            record1 = undefined;
          } else {
            record2 = undefined;
          }

          postInit(socket);
        }

      });
  }

  function postInit(socket: Socket) {
    socket
      .timeout(5000)
      .emit('/v1/users.php/init', {}, createSocketHandler<RugbullAPI.InitEvent>(event => {
        console.log('INIT', event)
        updateFromInitEvent(event)
      }))
  }

  onMount(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('TOKEN', token)
      socket = initSocket({token});
      postInit(socket);

      postHistory(socket);
    } else {
      notLogin = true;
    }

    const intervalId = setInterval(() => {
      if (energy < maxEnergy) {
        energy += energyPerSecond;
      }
    }, 1000);
    return () => {
      socket?.disconnect();
      clearInterval(intervalId);
    };
  });


  let errorMessageTimeoutId;
  $: {
    if (errorMessage) {
      errorMessageTimeoutId = setTimeout(() => {
        errorMessage = undefined;
      }, 5000)
    } else {
      clearTimeout(errorMessageTimeoutId)
    }
  }

  /// HANDLERS
  function onBetOrCashout(index: number) {
    return function () {
      if (socket) {
        const record = index === 0 ? record1 : record2;
        const setting = index === 0 ? setting1 : setting2;
        if (record) {
          postCashOut(socket, index, {recordId: record.id});
        } else {
          postMakeBet(socket, index, setting);
        }
      }
    }
  }

</script>

<main data-debug={debug}>
  {#if debug}
    <pre>round={currentRound} r1={record1?.id} r2={record2?.id}</pre>
  {/if}

  <Rugbull {startTime} {state} data={chart} currentMultiplier={multiplier} {connected}/>
  <HistoryRow {multiplierHistory}/>

  {#if notLogin}
    <ContainerV2 style="display: flex; align-items: center; justify-content: center">
      <a href="/login">
        <ActionButton>
          Login to play
        </ActionButton>
      </a>
    </ContainerV2>
  {:else}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
      <ContainerV2 style="display: grid">
        <EnergyBar amount={energy} maxAmount={maxEnergy}/>
        <span class="tag"
              style="margin: -10px 5px 0 0px; justify-self: right; border-radius: 10px; height: fit-content; z-index: 1;display: flex;align-items: center">Energy: {energy}
          <ZapIcon style="height: 16px; width: 16px"/></span>
      </ContainerV2>

      <ContainerV2 style="display: flex; align-items: center">
        <CoinsIcon/>
        <span class="bonus-text">{$bonus.toFixed(6)}</span>
      </ContainerV2>
    </div>
  {/if}

  <div class="bet-modules-row">
    <BetModule
        bind:betAmount={setting1.betAmount}
        bind:cashoutMultiplier={setting1.cashoutMultiplier}
        bind:auto={setting1.auto}
        currentMultiplier={multiplier}
        showCashout={record1 != null}
        available={150}
        on:bet={onBetOrCashout(0)}
    />
    <BetModule
        bind:betAmount={setting2.betAmount}
        bind:cashoutMultiplier={setting2.cashoutMultiplier}
        bind:auto={setting2.auto}
        available={150}
        currentMultiplier={multiplier}
        showCashout={record2 != null}
        on:bet={onBetOrCashout(1)}
    />
  </div>

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

  .bet-modules-row {
    display: grid;
    gap: 8px;
    @media (min-width: 470px) {
      grid-template-columns: 1fr 1fr;
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

  .bonus-text {
    font-size: 18px;
    @media (min-width: 400px) {
      font-size: 22px
    }
    @media (min-width: 480px) {
      font-size: 32px
    }
    @media (min-width: 570px) {
      font-size: 40px
    }
  }
</style>