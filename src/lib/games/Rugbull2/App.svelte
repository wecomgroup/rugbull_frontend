<script lang="ts">
  import { isDevMode } from "$lib/utils/isDevMode";
  import AppBackground from "$lib/games/Rugbull2/AppBackground.svelte";
  import { type Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import duration from "dayjs/plugin/duration";
  import { getSetting } from "./components/BetModule.svelte";
  import { spring } from "svelte/motion";
  import { hashToNumber } from "$lib/games/Rugbull/decrypt";
  import ResultsRow from "$lib/games/Rugbull2/components/ResultsRow.svelte";
  import ShieldIcon from "$lib/icons/ShieldIcon.svelte";
  import SoundOnIcon from "$lib/icons/SoundOnIcon.svelte";
  import SoundOffIcon from "$lib/icons/SoundOffIcon.svelte";
  import IconToggleButton from "$lib/components/buttons/IconToggleButton.svelte";
  import SubHeader from "./components/SubHeader.svelte";
  import Rugbull2Canvas from "$lib/games/Rugbull2/components/Rugbull2Canvas.svelte";
  import { _socketConnected, socket } from "$lib/stores/socket";
  import { userStore } from "$lib/stores/_user";
  import { loadSettings, soundOn } from "$lib/stores/_settings";
  import BetController from "./components/BetController.svelte";
  import { rugbull } from "$lib/stores/_rugbull";
  import LiveCashoutMobile, {
    randomUserEscape,
  } from "$lib/games/Rugbull2/components/LiveCashoutMobile.svelte";
  import FairnessModal from "$lib/games/Rugbull2/fairness/FairnessModal.svelte";
  import AppLayout from "$lib/games/Rugbull2/AppLayout.svelte";
  import { BetAPI } from "$lib/socket-api/bet";

  dayjs.extend(duration);

  export let debug = false;

  /// STATE
  let innerWidth = 0;
  let state = "connecting";
  let chart = [];
  let startTime = null;
  let secondsToStart = 0;
  let multiplier = 1;
  let multiplierHistory = [];
  let betHistoryPage = 1;
  let betHistoryLimit = 10;
  let currentRound: string | null = null;
  let messages: string[] = [];
  let errorMessage: string | undefined;
  let records: [Rugbull.Record?, Rugbull.Record?] = [];
  let useBonus = false;
  let bullState = 0;
  let openFairness = false;

  const distance = spring(0, { stiffness: 0.02 });
  const { userEscapes } = rugbull;

  // SOUND
  let soundCashout: HTMLAudioElement;
  let soundLaugh: HTMLAudioElement;
  let soundStart: HTMLAudioElement;
  let soundGetReady: HTMLAudioElement;

  const { energy, user } = userStore;

  /// REACTIVE
  $: {
    useBonus = !$energy.energy || $energy.energy < 150;
  }

  $: {
    if (state === "running") {
      if (multiplier > 10) {
        bullState = 4;
      } else if (multiplier > 2) {
        bullState = 3;
      } else if (multiplier > 1.2) {
        bullState = 2;
      } else {
        bullState = 1;
      }

      distance.set((multiplier - 1) * 1000 * (bullState * 1.2));
    } else if (state === "stopped") {
      bullState = 5;
    } else if (state === "waiting") {
      distance.set(0, { hard: true });
      bullState = 0;
    } else {
      distance.set(0);
      bullState = 0;
    }
  }

  $: {
    if (state === "stopped") {
      soundLaugh.currentTime = 0;
      $soundOn && soundLaugh.play();
    }
  }

  $: {
    if (state === "running") {
      soundStart.currentTime = 0;
      $soundOn && soundStart.play();
    }
  }

  $: {
    if (state === "waiting") {
      soundGetReady.currentTime = 0;
      $soundOn && soundGetReady.play();
    }
  }

  $: {
    if (!$soundOn) {
      soundCashout?.pause();
      soundLaugh?.pause();
      soundStart?.pause();
      soundGetReady?.pause();
    }
  }

  $: {
    if (state !== "connecting" && !$_socketConnected) {
      state = "reconnecting";
    } else if (state === "connecting" && $_socketConnected) {
      state = "loading";
    }
  }

  /// COMMON FUNCTIONS
  function formatDuration(value: number | null | undefined) {
    if (value == null) return undefined;
    return dayjs.duration(value).format("mm:ss");
  }

  function formatMultiplier(value: number) {
    return "x" + value.toFixed(2);
  }

  function checkError(err, response) {
    if (err) {
      console.error(err);
      return true;
    }
    if (response.ok === 0) {
      errorMessage = response.error;
      return true;
    }
    if (response.output?.payload?.statusCode >= 300) {
      errorMessage = response.output.payload.message;
      return true;
    }
    if (response.statusCode >= 300) {
      console.log("ERROR", response);
      errorMessage = response.message;
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
      } else if (event.statusCode === 401) {
        console.log("TOKEN EXPIRED");
        localStorage.removeItem("token");
      } else {
        console.log("UNHANDLED EVENT", event);
      }
    };
  }

  /// HANDLE STATE
  function updateFromInitEvent(event: RugbullAPI.InitEvent) {
    /// Load records when page reload
    if (records.length === 0) {
      event.users_bet.forEach((bet, index) => {
        records[index] = {
          id: bet.recordId,
          auto: !!bet.auto,
          amount: parseFloat(bet.amount),
        };
      });
    }
  }

  /// FUNCTIONS
  function log(message: string) {
    const formattedMessage = `${formatTimeMs(Date.now())} - ${message}`;
    if (!debug) {
      console.log(formattedMessage);
      return;
    }

    messages = [formattedMessage, ...messages];
    if (messages.length > 200) {
      messages = messages.slice(0, 200);
    }
  }

  function formatTime(v) {
    return dayjs(v).format("HH:mm:ss");
  }

  function formatTimeMs(v) {
    return dayjs(v).format("HH:mm:ss.SSS");
  }

  function getGameInfo(socket: Socket) {
    socket.timeout(5000).emit(
      "/v1/games.php/info",
      {},
      createSocketHandler<RugbullAPI.GameEvent>((data) => {
        console.log("INFO", data);
        if (data.status === "1") {
          startTime = parseInt(data.startTime);
          state = "waiting";
          currentRound = data.round;
        }
      }),
    );
  }

  function getGameResults(socket: Socket) {
    socket.timeout(5000).emit(
      "/v1/games.php/result",
      {
        limit: 20,
        page: 1,
      },
      createSocketHandler<RugbullAPI.ResultEvent>((event) => {
        console.log("RESULTS event", event);
        const data = event.rows;
        data.forEach((i) => {
          i.multiplier = hashToNumber(i.encryption);
        });
        multiplierHistory = data.map((i) => i.multiplier);
      }),
    );
  }

  /// SOCKET HANDLERS
  function initSocketOnMount() {
    console.log("Init socket");

    socket.on("connect", () => {
      getGameInfo(socket);
      getGameResults(socket);
    });

    socket.on("gameEvent", (event: RugbullAPI.RoundEvent) => {
      if (event.status === 1) {
        startTime = event.startTime;
        state = "waiting";
        multiplier = 1;
        chart = [];
        rugbull.reset();
        currentRound = event.round.toString();
        log(`[1] ROUND(${event.round}) starts=${formatTime(event.startTime)}`);
      } else if (event.status === 2) {
        state === "waiting" && log(`[2] START`);
        chart = [...chart, event.multiplier];
        multiplier = event.multiplier;

        state = "running";
        currentRound = event.round.toString();
        // log(`[2] ${event.elapsed} ${event.multiplier.toFixed(2)}`)
      } else if (event.status === 3) {
        getGameResults(socket);
        chart = [...chart, 0];
        if (state !== "loading") {
          state = "stopped";
        }
        multiplier = 0;
        currentRound = event.round.toString();
        records = [undefined, undefined];
        rugbull.reset();
        postHistory(socket);
        log(`[3] stopped ${event.multiplier.toFixed(2)}`);
      }
    });

    socket.on("trumpetOfVictory", (event: RugbullAPI.VictoryEvent) => {
      console.log("EVENT trumpetOfVictory", event);
      soundCashout.currentTime = 0;
      $soundOn && soundCashout.play();
      const index = records.findIndex((r) => r?.id === event.recordId);
      if (index > -1) {
        records[index] = undefined;
        postHistory(socket);
      }
    });

    postUserInit(socket);
    postHistory(socket);
  }

  function postHistory(socket: Socket) {
    socket.timeout(5000).emit(
      "/v1/games.php/history",
      {
        limit: betHistoryLimit,
        page: betHistoryPage,
      },
      createSocketHandler<RugbullAPI.HistoryEvent>((data) => {
        console.log("HISTORY", data);
      }),
    );
  }

  async function postMakeBet(
    socket: Socket,
    index: number,
    setting: Rugbull.Setting,
  ) {
    errorMessage = undefined;
    const coinType = useBonus ? 2 : 1;
    const payload = {
      round: currentRound,
      coinType,
      auto: setting.auto ? 1 : 0,
      multiplier: setting.cashoutMultiplier,
      amount: setting.betAmount,
    };

    console.log("BET", payload);

    const data = await BetAPI.bet(payload);
    records[index] = {
      id: data.recordId,
      auto: setting.auto,
      amount: setting.betAmount,
    };

    if (coinType === 1) {
      userStore.updateEnergy(data.newBalance);
    }

    postUserInit(socket);
  }

  function postCashOut(
    socket: Socket,
    index: number,
    params: {
      recordId: number;
    },
  ) {
    const payload = {
      recordId: params.recordId,
    };
    console.log("CASHOUT", payload);

    socket.timeout(5000).emit(
      "/v1/games.php/cashout",
      payload,
      createSocketHandler<any>((data) => {
        console.log("CASHOUT RESPONSE", data);
        records[index] = undefined;
        postUserInit(socket);
      }),
    );
  }

  function postUserInit(socket: Socket) {
    socket.timeout(5000).emit(
      "/v1/users.php/init",
      {},
      createSocketHandler<RugbullAPI.InitEvent>((event) => {
        console.log("INIT", event);
        updateFromInitEvent(event);
      }),
    );
  }

  onMount(() => {
    loadSettings();
    initSocketOnMount();

    const intervalId2 = setInterval(() => {
      if (startTime) {
        secondsToStart = Math.max(
          0,
          Math.ceil((startTime - Date.now()) / 1000),
        );
      }
    }, 100);

    return () => {
      clearInterval(intervalId2);
    };
  });

  let errorMessageTimeoutId;
  $: {
    if (errorMessage) {
      errorMessageTimeoutId = setTimeout(() => {
        errorMessage = undefined;
      }, 5000);
    } else {
      clearTimeout(errorMessageTimeoutId);
    }
  }

  $: {
    if (betHistoryPage && socket) {
      postHistory(socket);
    }
  }

  /// HANDLERS
  function onBetOrCashout(index: number) {
    if (socket) {
      const record = records[index];
      const setting = getSetting(`setting-${index}`);
      if (record) {
        postCashOut(socket, index, { recordId: record.id });
      } else {
        postMakeBet(socket, index, setting);
      }
    }
  }
</script>

<AppLayout>
  <div slot="animation">
    <AppBackground speed={multiplier} distance={$distance}>
      <div
        slot="header"
        class="grid gap-2 p-2"
        style="grid-template-columns: auto auto 1fr"
      >
        <IconToggleButton
          iconTrue={ShieldIcon}
          iconFalse={ShieldIcon}
          selected={true}
          buttonOnly={true}
          on:click={() => (openFairness = true)}
        />
        <IconToggleButton
          bind:selected={$soundOn}
          iconTrue={SoundOnIcon}
          iconFalse={SoundOffIcon}
        />
        <ResultsRow results={multiplierHistory} />
      </div>
      <div slot="sub-header">
        {#if state === "waiting"}
          <SubHeader
            label="Next game"
            number={formatDuration(secondsToStart * 1000)}
          />
        {:else if state === "running"}
          <SubHeader
            label="Current multiplier"
            number={formatMultiplier(multiplier)}
          />
        {:else if !$user.login}
          <SubHeader label="Not login" number="Login to play" />
        {:else}
          <SubHeader label={state} number={state} />
        {/if}
      </div>
      <div slot="body" class="h-full relative">
        <div class="w-full absolute bottom-0">
          <Rugbull2Canvas
            width={innerWidth >= 768 ? 800 : innerWidth >= 568 ? 600 : 400}
            height={400}
            state={bullState}
            style="width: 100%"
            distance={$distance}
            {multiplier}
          />
        </div>
      </div>
    </AppBackground>
  </div>
  <div slot="controller" class="flex flex-col">
    <div class="fake-controller-header">
      <div class="my-2">
        <LiveCashoutMobile
          items={[
            ...$userEscapes.map((i) => ({ ...i, isUser: $user.userId.toString() === i.userId })),
            ...(isDevMode
              ? [
                  randomUserEscape(),
                  randomUserEscape(),
                  randomUserEscape(),
                  randomUserEscape(),
                ]
              : []),
          ]}
          style="padding-left: 0.5rem; padding-right: 0.5rem"
        />
      </div>
    </div>
    {#if $user.login}
      <BetController
        {multiplier}
        showCashout0={records[0] != null}
        showCashout1={records[1] != null}
        coinType={useBonus ? 2 : 1}
        gameState={state}
        on:action={(e) => {
          onBetOrCashout(e.detail);
        }}
      />
    {/if}
  </div>
</AppLayout>

<FairnessModal bind:open={openFairness} />

<audio bind:this={soundCashout} src="/sound/rugbull/kaching.mp3" />
<audio bind:this={soundLaugh} src="/sound/rugbull/laugh.mp3" />
<audio bind:this={soundStart} src="/sound/rugbull/dog-start.mp3" />
<audio bind:this={soundGetReady} src="/sound/rugbull/get-ready.mp3" />

<svelte:window bind:innerWidth />

<style>
  .fake-controller-header {
    margin-top: -1.5rem;
    padding-bottom: 1rem;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    border-top: 2px solid var(--background-2);
    height: 2rem;
    background: var(--background);
    z-index: 10;
  }
</style>
