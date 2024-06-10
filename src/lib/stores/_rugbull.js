import {writable} from 'svelte/store';


class RugbullStore {
  /**@type {import('svelte/store').Writable<Rugbull.UserEscape[]>}*/
  userEscapes = writable([])

  constructor() {
  }

  subscribe(/**@type {import("socket.io-client").Socket}*/socket) {
    socket.on("userEscapes", (/**@type{RugbullAPI.UserEscapeEvent}*/event) => {
      console.log("EVENT userEscapes", event);
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
}

export const rugbull = new RugbullStore();