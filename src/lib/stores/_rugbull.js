import { writable } from 'svelte/store';
import { soundOn } from "$lib/stores/_settings.js";
import { formatTime } from '$lib/utils/format';
import { GameAPI } from '$lib/socket-api/game';
import { log } from '$lib/utils/log';


const STATUS_BY_CODE = {
  1: "waiting",
  2: "running",
  3: "stopped",
}

class RugbullStore {
  /**@type {import('svelte/store').Writable<Rugbull.UserEscape[]>}*/
  userEscapes = writable([])
  multiplier = writable(1)
  state = "loading"
  round = writable({
    currentRound: '',
    startTime: 0,
    state: this.state,
  })

  constructor() {
    this.round.subscribe((r) => {
      log(`ROUND ${r.currentRound} ${r.state}`)
    })
  }

  subscribe(/**@type {import("socket.io-client").Socket}*/socket) {
    socket.on('connect', () => {
      GameAPI.getGameInfo().then((event) => {
        if (event.status === "1") {
          this.round.set({
            startTime: parseInt(event.startTime),
            state: STATUS_BY_CODE[event.status],
            currentRound: event.round.toString()
          })
        }
        else if (event.status === "3") {
          this.round.set({
            state: "waitingNextGame",
            startTime: 0,
            currentRound: "",
          })
        }
      })
    })

    socket.on("gameEvent", (/**@type {RugbullAPI.RoundEvent}*/event) => {
      if (event.status === 1) {
        this.state = "waiting"
        this.round.set({
          currentRound: event.round.toString(),
          startTime: event.startTime,
          state: this.state,
        })
        this.multiplier.set(1)
        rugbullStore.reset();
      } else if (event.status === 2) {
        if (this.state === "waiting" || this.state === "loading") {
          this.state = "running";
          this.round.update((r) => {
            r.state = this.state
            r.currentRound = event.round.toString();
            return r;
          })
        }
        this.multiplier.set(event.multiplier)
        // log(`[2] ${event.elapsed} ${event.multiplier.toFixed(2)}`)
      } else if (event.status === 3) {
        if (this.state !== "loading") {
          this.state = "stopped"
          this.round.update((r) => {
            if (r.state !== "loading") {
              r.state = this.state
            }
            r.currentRound = event.round.toString();

            return r;
          })
        }
        this.multiplier.set(0);
        this.reset()
      }
    });

    socket.on("userEscapes", (/**@type{RugbullAPI.UserEscapeEvent}*/event) => {
      console.log("EVENT userEscapes", event);

      // Add escapes on user escape
      this.userEscapes.update(u => {
        /** @type {Rugbull.UserEscape[]} */
        const list = event.userList.map((i) => {
          return {
            key: u.length.toString(),
            multiplier: parseFloat(i.multiplier),
            amount: parseFloat(i.amount) * parseFloat(i.multiplier),
            userName: i.nickName,
            avatar: '/images/user/avatar.jpg',
            time: Date.now(),
            userId: i.userId,
            isUser: false,
          }
        })

        return [
          ...list,
          ...u,
        ];
      })
    });
  }

  reset() {
    this.userEscapes.set([]);
  }

  async updateCurrentRound() {
    const event = await GameAPI.getGameInfo();
    if (event.status === "1") {
      this.round.set({
        startTime: parseInt(event.startTime),
        state: "waiting",
        currentRound: event.round.toString()
      })
    }
  }
}

export const rugbullStore = new RugbullStore();
