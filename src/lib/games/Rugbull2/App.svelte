<script lang="ts">
  import AppBackground from "$lib/games/Rugbull2/AppBackground.svelte";
  import {io, type Socket} from 'socket.io-client';
  import {onMount} from 'svelte';
  import dayjs from "dayjs";
  import ShareLink from "$lib/components/display/ShareLink.svelte";
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
  import {hashToNumber} from "$lib/games/Rugbull/decrypt";
  import ResultsRow from "$lib/games/Rugbull2/components/ResultsRow.svelte";
  import ShieldIcon from "$lib/icons/ShieldIcon.svelte";
  import SoundOnIcon from "$lib/icons/SoundOnIcon.svelte";
  import SoundOffIcon from "$lib/icons/SoundOffIcon.svelte";
  import IconToggleButton from "$lib/components/buttons/IconToggleButton.svelte";

  export let debug = false;

  /// STATE
  let state = 'connecting';
  let clientSeed = undefined;
  let serverHash = undefined;
  let lastRound = undefined;
  let userId = undefined;
  let chart = [];
  let startTime = null;
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
  let useCashout;
  let userEscapes: Rugbull.UserEscape[] = [];
  let useBonus = false;

  const bonus = spring(0)

  // SOUND
  let soundCashout: HTMLAudioElement;

  /// SOCKET
  let socket: Socket | undefined

  /// REACTIVE
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
        console.log('RESULTS event', event)
        const data = event.rows;
        serverHash = data[0].encryption;
        lastRound = data[0].round;
        data.forEach(i => {
          i.multiplier = hashToNumber(i.encryption)
        })
        multiplierHistory = data.map(i => i.multiplier)
        console.log('RESULTS multiplierHistory', multiplierHistory)
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

<AppBackground>
  <div slot="header" class="grid gap-2 p-2" style="grid-template-columns: auto auto 1fr">
    <IconToggleButton iconTrue={ShieldIcon} iconFalse={ShieldIcon} selected={true}/>
    <IconToggleButton iconTrue={SoundOnIcon} iconFalse={SoundOffIcon}/>
    <ResultsRow results={multiplierHistory}/>
  </div>
</AppBackground>

