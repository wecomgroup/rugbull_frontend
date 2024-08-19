<script lang="ts">
  import { isDevMode } from "$lib/utils/isDevMode";
  import AppBackground from "$lib/games/Rugbull2/AppBackground.svelte";
  import { type Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import duration from "dayjs/plugin/duration";
  import { getSetting } from "./components/BetModule.svelte";
  import { spring } from "svelte/motion";
  import ResultsRow from "$lib/games/Rugbull2/components/ResultsRow.svelte";
  import ShieldIcon from "$lib/icons/ShieldIcon.svelte";
  import SoundOnIcon from "$lib/icons/SoundOnIcon.svelte";
  import SoundOffIcon from "$lib/icons/SoundOffIcon.svelte";
  import IconToggleButton from "$lib/components/buttons/IconToggleButton.svelte";
  import SubHeader from "./components/SubHeader.svelte";
  import Rugbull2Canvas from "$lib/games/Rugbull2/components/Rugbull2Canvas.svelte";
  import { socketStore } from "$lib/stores/socket";
  import { userStore } from "$lib/stores/_user";
  import { loadSettings, soundOn } from "$lib/stores/_settings";
  import BetController from "./components/BetController.svelte";
  import { rugbullStore } from "$lib/stores/_rugbull";
  import LiveCashoutMobile, {
    randomUserEscape,
  } from "$lib/games/Rugbull2/components/LiveCashoutMobile.svelte";
  import FairnessModal from "$lib/games/Rugbull2/fairness/FairnessModal.svelte";
  import AppLayout from "$lib/games/Rugbull2/AppLayout.svelte";
  import { BetAPI } from "$lib/socket-api/bet";
  import { betStore } from "$lib/stores/_bet";
    import { browser } from "$app/environment";
    import { GameAPI } from "$lib/socket-api/game";

  dayjs.extend(duration);

  export let debug = false;

  /// STATE
  let innerWidth = 0;
  let secondsToStart = 0;
  let errorMessage: string | undefined;
  let useBonus = false;
  let bullState = 0;
  let openFairness = false;

  const distance = spring(0, { stiffness: 0.02 });

  // SOUND
  let soundCashout: HTMLAudioElement;
  let soundLaugh: HTMLAudioElement;
  let soundStart: HTMLAudioElement;
  let soundGetReady: HTMLAudioElement;

  const { energy, user } = userStore;
  const { records } = betStore;
  const { userEscapes, round, multiplier, multiplierHistory } = rugbullStore;

  /// REACTIVE
  $: {
    useBonus = !$energy.current || $energy.current < 150;
  }

  $: {
    if ($round.state === "running") {
      if ($multiplier > 10) {
        bullState = 4;
      } else if ($multiplier > 2) {
        bullState = 3;
      } else if ($multiplier > 1.2) {
        bullState = 2;
      } else {
        bullState = 1;
      }

      distance.set(($multiplier - 1) * 1000 * (bullState * 1.2));
    } else if ($round.state === "stopped") {
      bullState = 5;
    } else if ($round.state === "waiting") {
      distance.set(0, { hard: true });
      bullState = 0;
    } else {
      distance.set(0);
      bullState = 0;
    }
  }

  $: {
    if (soundLaugh && $round.state === "stopped") {
      soundLaugh.currentTime = 0;
      $soundOn && soundLaugh.play();
    }
  }

  $: {
    if (soundStart && $round.state === "running") {
      soundStart.currentTime = 0;
      $soundOn && soundStart.play();
    }
  }

  $: {
    if (soundGetReady && $round.state === "waiting") {
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
    if ($round.state === "stopped") {
      betStore.reset();
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

  /// FUNCTIONS

  function playSound(sound: HTMLAudioElement) {
    if (sound != null && $soundOn) {
      sound.currentTime = 0;
      $soundOn && sound.play();
    }
  }

  /// SOCKET HANDLERS
  function initSocketOnMount() {
    socketStore.socket.on("trumpetOfVictory", (event: RugbullAPI.VictoryEvent) => {
      console.log("EVENT trumpetOfVictory", event);
      playSound(soundCashout);
      betStore.resetByRecordId(event.recordId);
    });
  }

  async function postMakeBet(
    socket: Socket,
    index: number,
    setting: Rugbull.Setting,
  ) {
    errorMessage = undefined;
    const coinType = useBonus ? 2 : 1;
    const payload = {
      round: $round.currentRound,
      coinType,
      auto: setting.auto ? 1 : 0,
      multiplier: setting.cashoutMultiplier,
      amount: setting.betAmount,
    };

    console.log("BET", payload);

    const data = await BetAPI.bet(payload);
    betStore.setRecord(index, {
      id: data.recordId,
      auto: setting.auto,
      amount: setting.betAmount,
    });

    if (coinType === 1) {
      userStore.updateEnergy(data.newBalance);
    }
  }

  async function postCashOut(
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

    await GameAPI.cashout({
      recordId: params.recordId,
    });
  }

  onMount(() => {
    loadSettings();
    initSocketOnMount();

    const intervalId2 = setInterval(() => {
      if ($round.startTime) {
        secondsToStart = Math.max(
          0,
          Math.ceil(($round.startTime - Date.now()) / 1000),
        );
      }
    }, 100);

    return () => {
      clearInterval(intervalId2)
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

  /// HANDLERS
  function onBetOrCashout(index: number) {
    if (socketStore.socket) {
      const record = $records[index];
      const setting = getSetting(`setting-${index}`);
      if (record.id !== -1) {
        postCashOut(socketStore.socket, index, { recordId: record.id });
      } else {
        postMakeBet(socketStore.socket, index, setting);
      }
    }
  }
</script>

<AppLayout>
  <div slot="animation">
    <AppBackground speed={$multiplier} distance={$distance}>
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
        <ResultsRow results={$multiplierHistory} />
      </div>
      <div slot="sub-header">
        {#if $round.state === "waiting"}
          <SubHeader
            label="Next game"
            number={formatDuration(secondsToStart * 1000)}
          />
        {:else if $round.state === "waitingNextGame"}
          <SubHeader label="Waiting for next game" number={"Waiting"} />
        {:else if $round.state === "running"}
          <SubHeader
            label="Current multiplier"
            number={formatMultiplier($multiplier)}
          />
        {:else}
          <SubHeader label={$round.state} number={$round.state} />
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
            multiplier={$multiplier}
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
            ...$userEscapes,
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
        multiplier={$multiplier}
        showCashout0={$records[0].id !== -1}
        showCashout1={$records[1].id !== -1}
        coinType={useBonus ? 2 : 1}
        gameState={$round.state}
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
