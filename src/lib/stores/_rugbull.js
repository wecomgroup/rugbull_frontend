import { writable } from 'svelte/store';
import { soundOn } from "$lib/stores/_settings.js";
import { formatTime } from '$lib/utils/format';
import { GameAPI } from '$lib/socket-api/game';
import { log } from '$lib/utils/log';


class RugbullStore {
  /**@type {import('svelte/store').Writable<Rugbull.UserEscape[]>}*/
  userEscapes = writable([])
  multiplier = writable(1)
  state = "waiting"
  round = writable({
    currentRound: '',
    startTime: 0,
    state: "waiting"
  })

  constructor() {
    this.round.subscribe((r) => {
      console.log("ROUND", r)
    })
  }

  subscribe(/**@type {import("socket.io-client").Socket}*/socket) {
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
        log(`[1] NEW ROUND [${event.round}] at ${formatTime(event.startTime)}`);
      } else if (event.status === 2) {
        if (this.state === "waiting") {
          log(`[2] START`);
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
        log(`[3] STOPPED ${event.multiplier.toFixed(2)}`);
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
