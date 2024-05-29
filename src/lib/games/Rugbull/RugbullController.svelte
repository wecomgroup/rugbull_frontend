<script lang="ts">
  import Rugbull, {type IRugbull} from '$lib/games/Rugbull/Rugbull.svelte';
  import {io, type Socket} from 'socket.io-client';
  import {onMount} from 'svelte';
  import dayjs from "dayjs";
  import ShareLink from "$lib/components/display/ShareLink.svelte";
  import {hashToNumber} from './decrypt'
  import {fly} from 'svelte/transition';
  import ErrorContainer from "$lib/components/bet-controller/ErrorContainer.svelte";
  import BetModule, {getSetting} from "$lib/components/bet-controller/BetModule.svelte";
  import ContainerV2 from "$lib/components/bet-controller/ContainerV2.svelte";
  import {spring} from "svelte/motion";
  import HistoryRow from "$lib/components/bet-controller/HistoryRow.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import BetHistory from "$lib/components/bet-controller/BetHistory.svelte";
  import EnergyModule from "$lib/components/bet-controller/EnergyModule.svelte";
  import BonusModule from "$lib/components/bet-controller/BonusModule.svelte";

  /// PARAMS
  export let debug = false;

  /// TYPE

  /// STATE
  let clientSeed = undefined;
  let serverHash = undefined;
  let lastRound = undefined;
  let userId = undefined;
  let chart = [];
  let startTime = null;
  let state: IRugbull.GameState = 'connecting';
  let connected = false;
  let multiplier = 1;
  let multiplierHistory = []
  let betHistory: RugbullAPI.UserBet[] = []
  let betHistoryPage = 1;
  let betHistoryCount = 0;
  let betHistoryLimit = 10;
  let currentRound: string | null = null;
  let messages: string[] = []
  let errorMessage: string | undefined;
  let records: [Rugbull.Record?, Rugbull.Record?] = [];
  let energy = 0;
  let maxEnergy = 1000;
  let energyPerSecond = 1;
  let notLogin = false;
  let userEscapes: IRugbull.UserEscape[] = [];
  let useCashout;
  let useBonus = false;
  const bonus = spring(0)

  // SOUND
  let soundCashout: HTMLAudioElement;

  /// SOCKET
  let socket: Socket | undefined

  /// REACTIVE
  $: {
    log(`> ROUND=${currentRound}`)
  }

  $: {
    useBonus = !energy || energy < 150;
  }

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
    if (response.output?.payload?.statusCode >= 300) {
      errorMessage = response.output.payload.message;
      return true
    }
    if (response.statusCode >= 300) {
      console.log('ERROR', response)
      errorMessage = response.message;
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
      } else if (event.statusCode === 401) {
        console.log('TOKEN EXPIRED');
        localStorage.removeItem('token')
        notLogin = true;
      } else {
        console.log('UNHANDLED EVENT', event)
      }

    }
  }

  /// HANDLE STATE
  function updateFromInitEvent(event: RugbullAPI.InitEvent) {
    energyPerSecond = event.users_energy.energyAccumulationRate;
    maxEnergy = event.users_energy.energyCapacity;
    energy = Math.min(maxEnergy, Math.floor(-dayjs(event.users_energy.lastUpdateTime).diff() / 1000 * energyPerSecond + event.users_energy.currentEnergy))
    bonus.set(parseFloat(event.users_wallet.userBonus));
    userId = event.userId;

    /// Load records when page reload
    if (records.length === 0) {
      event.users_bet.forEach((bet, index) => {
        records[index] = {
          id: bet.recordId,
          auto: !!bet.auto,
          amount: parseFloat(bet.amount),
        }
      })
    }
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

  function getGameInfo(socket: Socket) {
    socket.timeout(5000)
      .emit('/v1/games.php/info', {},
        createSocketHandler<RugbullAPI.GameEvent>((data) => {
          console.log('INFO', data)
          if (data.status === '1') {
            startTime = parseInt(data.startTime);
            state = 'waiting'
            currentRound = data.round
          }
        }));
  }

  function getGameResults(socket: Socket) {
    socket
      .timeout(5000)
      .emit('/v1/games.php/result', {
        limit: 20,
        page: 1,
      }, createSocketHandler<RugbullAPI.ResultEvent>((event) => {
        console.log('RESULTS', event)
        const data = event.rows;
        serverHash = data[0].encryption;
        lastRound = data[0].round;
        data.forEach(i => {
          i.multiplier = hashToNumber(i.encryption)
        })
        multiplierHistory = data.map(i => i.multiplier)
      }))
  }

  /// SOCKET HANDLERS
  function initSocket({token}) {
    const socket = io('https://api.rugbull.io', {
      extraHeaders: {
        Authorization: token,
      },
    });
    socket.on('disconnect', () => {
      connected = false;
      state = 'reconnecting';
    });

    socket.on('connect', () => {
      state = 'loading'
      connected = true;
      getGameInfo(socket);
      getGameResults(socket);
    });

    socket.on('gameEvent', (event: RugbullAPI.RoundEvent) => {
      if (event.status === 1) {
        startTime = event.startTime;
        state = 'waiting';
        chart = [];
        userEscapes = []
        currentRound = event.round.toString()
        log(`[1] ROUND(${event.round}) starts=${formatTime(event.startTime)}`)
      } else if (event.status === 2) {
        state === 'waiting' && log(`[2] START`)
        chart = [...chart, event.multiplier];
        multiplier = event.multiplier;

        state = 'running';
        currentRound = event.round.toString()
        // log(`[2] ${event.elapsed} ${event.multiplier.toFixed(2)}`)
      } else if (event.status === 3) {
        getGameResults(socket)
        chart = [...chart, 0];
        if (state !== 'loading') {
          state = 'stopped';
        }
        multiplier = 1;
        currentRound = event.round.toString()
        records = [undefined, undefined]
        userEscapes = []
        postHistory(socket)
        log(`[3] stopped ${event.multiplier.toFixed(2)}`)
      }
    });

    socket.on('trumpetOfVictory', (event: RugbullAPI.VictoryEvent) => {
      console.log('EVENT trumpetOfVictory', event)
      soundCashout.currentTime = 0
      soundCashout.play();
      const index = records.findIndex(r => r?.id === event.recordId);
      if (index > -1) {
        records[index] = undefined;
        postHistory(socket)
      }
    })

    socket.on('userEscapes', (event: RugbullAPI.UserEscapeEvent) => {
      console.log('EVENT userEscapes', event)
      userEscapes = [
        ...userEscapes,
        ...event.userList.map(i => {
          return ({
            multiplier: parseFloat(i.multiplier),
            userName: i.nickName,
            time: chart.length,
          })
        })
      ]

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
      .emit('/v1/games.php/history', {
        limit: betHistoryLimit,
        page: betHistoryPage,
      }, createSocketHandler<RugbullAPI.HistoryEvent>(data => {
        console.log('HISTORY', data)
        betHistoryCount = data.count;
        betHistory = data.rows;
      }))
  }

  function postMakeBet(socket: Socket, index: number, setting: Rugbull.Setting) {
    errorMessage = undefined;
    const coinType = useBonus ? 2 : 1;
    const payload = {
      round: currentRound,
      coinType,
      auto: setting.auto ? 1 : 0,
      multiplier: setting.cashoutMultiplier,
      amount: setting.betAmount,
    }

    console.log('BET', payload)

    socket
      .timeout(5000)
      .emit('/v1/games.php/bet', payload,
        createSocketHandler<any>(
          (data) => {
            console.log('BET RESPONSE', data)
            records[index] = {
              id: data.recordId,
              auto: setting.auto,
              amount: setting.betAmount
            };

            if (coinType === 1) {
              energy = data.newBalance;
            }

            postUserInit(socket);

          }));
  }

  function postCashOut(socket: Socket, index: number, params: {
    recordId: number,
  }) {
    const payload = {
      recordId: params.recordId,
    }
    console.log('CASHOUT', payload)

    socket
      .timeout(5000)
      .emit('/v1/games.php/cashout', payload,
        createSocketHandler<any>(
          (data) => {
            console.log('CASHOUT RESPONSE', data)
            records[index] = undefined;
            postUserInit(socket);

          }));
  }

  function postUserInit(socket: Socket) {
    socket
      .timeout(5000)
      .emit('/v1/users.php/init', {},
        createSocketHandler<RugbullAPI.InitEvent>(event => {
          console.log('INIT', event)
          updateFromInitEvent(event)
        }))
  }


  onMount(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socket = initSocket({token});

      postUserInit(socket);
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

  $: {
    if (betHistoryPage && socket) {
      postHistory(socket)
    }
  }

  /// HANDLERS
  function onBetOrCashout(index: number) {
    return function () {
      if (socket) {
        const record = records[index];
        const setting = getSetting(`setting-${index}`)
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
    <pre>round={currentRound}</pre>
  {/if}

  <Rugbull
      {startTime}
      {state}
      data={chart}
      currentMultiplier={multiplier}
      {connected}
      escapes={userEscapes}
  />
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
      <EnergyModule energy={energy} maxEnergy={maxEnergy} glow={!useBonus}/>
      <BonusModule bonus={$bonus} glow={useBonus}/>
    </div>
  {/if}

  <div class="bet-modules-row">
    <BetModule
        id="setting-0"
        currentMultiplier={multiplier}
        showCashout={records[0] != null}
        available={150}
        on:bet={onBetOrCashout(0)}
    />
    <BetModule
        id="setting-1"
        available={150}
        currentMultiplier={multiplier}
        showCashout={records[1] != null}
        on:bet={onBetOrCashout(1)}
    />
  </div>

  {#if errorMessage}
    <button transition:fly={{y: -20}}
            on:click={() => errorMessage = undefined}
            style="padding: 0"
    >
      <ErrorContainer>
        {errorMessage}
      </ErrorContainer>
    </button>
  {/if}

  <ShareLink/>
  <ContainerV2 style="display: grid; justify-items: center">
    <a href="/games/rugbull/fairness" style="color:var(--brand)"> Provable Fairness</a>
  </ContainerV2>

  <BetHistory {betHistory} totalCount={betHistoryCount} bind:page={betHistoryPage} limit={betHistoryLimit}/>

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

<audio bind:this={soundCashout} src='/sound/rugbull/kaching.mp3'/>

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