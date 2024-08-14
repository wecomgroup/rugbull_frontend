import { writable } from 'svelte/store';
import { socketStore } from "$lib/stores/socket.js";
import dayjs from "dayjs";
import { UserAPI } from '$lib/socket-api/user';


class UserStore {
  coin = writable(0)
  energy = writable({
    current: 0,
    maxEnergy: 1000,
    energyPerSecond: 1,
  })

  userId = -1;
  user = writable({
    login: false,
    userId: -1,
  })

  alreadySubscribed = false;

  constructor() {
    this.user.subscribe(user => {
      this.userId = user.userId
      console.log("USER", this.userId)
    })
  }

  subscribe() {
    if (this.alreadySubscribed) {
      console.error("Already subscribed");
      return;
    }
    this.alreadySubscribed = true;

    const { socket } = socketStore;

    socket.on("balanceEvent", (event) => {
      console.log("EVENT balance", event);

      if (event.coinType === 1) {
        this.updateEnergy(event.currentEnergy);
      } else if (event.coinType === 2) {
        this.coin.set(parseFloat(event.userBonus));
      }
    });

    const intervalId = setInterval(() => {
      this.energy.update(it => {
        if (it.current < it.maxEnergy) {
          it.current += it.energyPerSecond
        }
        return it
      })
    }, 1000);

    socket.on("connect", () => {
      this.reload()
    })

    socket.on("disconnect", () => {
      clearInterval(intervalId)
    })

  }

  async reload() {
    const event = await UserAPI.getInit()
    const energyPerSecond = event.users_energy.energyAccumulationRate
    const maxEnergy = event.users_energy.energyCapacity;
    const currentEnergy = Math.min(
      maxEnergy,
      Math.floor(
        (-dayjs(event.users_energy.lastUpdateTime).diff() / 1000) *
        energyPerSecond +
        event.users_energy.currentEnergy,
      ),
    );

    this.energy.set({
      current: currentEnergy,
      maxEnergy,
      energyPerSecond: energyPerSecond,
    })

    this.coin.set(parseFloat(event.users_wallet.userBonus))
    this.user.set({
      login: true,
      userId: event.userId
    })
  }

  updateEnergy(energy) {
    this.energy.update(it => {
      it.current = energy
      return it
    })
  }

  updateCoin(coin) {
    this.coin.set(coin)
  }
}

export const userStore = new UserStore();

