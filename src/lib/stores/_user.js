import { writable } from 'svelte/store';
import { createSocketHandler } from "$lib/stores/socket.js";
import dayjs from "dayjs";


class UserStore {
  coin = writable(0)
  energy = writable({
    energy: 0,
    maxEnergy: 1000,
    energyPerSecond: 1,
  })

  user = writable({
    login: false,
    userId: -1,
  })

  alreadySubscribed = false;

  subscribe(/**@type {import("socket.io-client").Socket}*/ socket) {
    if (this.alreadySubscribed) {
      console.error("Already subscribed");
      return;
    }
    this.alreadySubscribed = true;

    socket.on("balanceEvent", (event) => {
      console.log("EVENT balance", event);

      if (event.coinType === 1) {
        this.energy.set(event.currentEnergy);
      } else if (event.coinType === 2) {
        this.coin.set(parseFloat(event.userBonus));
      }
    });

    const intervalId = setInterval(() => {
      this.energy.update(it => {
        if (it.energy < it.maxEnergy) {
          it.energy += it.energyPerSecond
        }
        return it
      })
    }, 1000);

    socket.on("connect", () => {
      socket.timeout(5000).emit(
        "/v1/users.php/init",
        {},
        createSocketHandler((/**@type {RugbullAPI.InitEvent}*/event) => {
          console.log("INIT", event);
          this.updateFromInitEvent(event);
        }),
      );
    })

    socket.on("disconnect", () => {
      clearInterval(intervalId)
    })

  }

  updateFromInitEvent(/**@type {RugbullAPI.InitEvent}*/event) {
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
      energy: currentEnergy,
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
      it.energy = energy
      return it
    })
  }

  updateCoin(coin) {
    this.coin.set(coin)
  }
}

export const userStore = new UserStore();

