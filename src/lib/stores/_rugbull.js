import {writable} from 'svelte/store';


class RugbullStore {
  /**@type {import('svelte/store').Writable<Rugbull.UserEscape[]>}*/
  userEscapes = writable([])

  constructor() {
  }

  subscribe(/**@type {import("socket.io-client").Socket}*/socket) {
    socket.on("userEscapes", (/**@type{RugbullAPI.UserEscapeEvent}*/event ) => {
      console.log("EVENT userEscapes", event);
      this.userEscapes.update(u => {
        return [
          ...u,
          ...event.userList.map((i) => {
            return {
              multiplier: parseFloat(i.multiplier),
              amount: parseFloat(i.amount) * parseFloat(i.multiplier),
              userName: i.nickName,
              avatar: '',
              // time: chart.length,
              time: event.multiplier,
            };
          }),
        ];
      })
    });
  }

  reset() {
    this.userEscapes.set([]);
  }
}

export const rugbull = new RugbullStore();
