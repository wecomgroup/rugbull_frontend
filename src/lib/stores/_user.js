import {writable} from 'svelte/store';
import {createSocketHandler} from "$lib/stores/socket.js";
import dayjs from "dayjs";

export const _user = writable({
  login: false,
  userId: -1,
  energy: 0,
  bonus: 0,
  energyPerSecond: 0,
  maxEnergy: 0,
});


/**
 * @param socket {import("socket.io-client").Socket}
 */
export function subscribeUser(socket){
  socket.on("balanceEvent", (event) => {
    console.log("EVENT balanceEvent", event);

    if (event.coinType === 1) {
      _user.update((it) => {
        it.energy = event.currentEnergy;
        return it;
      })
    } else if (event.coinType === 2) {
      _user.update((it) => {
        it.bonus = parseFloat(event.userBonus);
        return it;
      })
    }
  });


  const intervalId = setInterval(() => {
    _user.update(it => {
      if (it.energy < it.maxEnergy) {
        it.energy += it.energyPerSecond;
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
        updateFromInitEvent(event);
      }),
    );
  })

  socket.on("disconnect", () => {
    clearInterval(intervalId)
  })

}

function updateFromInitEvent(/**@type {RugbullAPI.InitEvent}*/event) {
  const energyPerSecond = event.users_energy.energyAccumulationRate;
  const maxEnergy = event.users_energy.energyCapacity;
  const energy = Math.min(
    maxEnergy,
    Math.floor(
      (-dayjs(event.users_energy.lastUpdateTime).diff() / 1000) *
      energyPerSecond +
      event.users_energy.currentEnergy,
    ),
  );
  const bonus = parseFloat(event.users_wallet.userBonus)
  const userId = event.userId;

  _user.update(it => ({
    login: true,
    userId,
    energy,
    bonus,
    energyPerSecond,
    maxEnergy,
  }));

  /// Load records when page reload
  // if (records.length === 0) {
  //   event.users_bet.forEach((bet, index) => {
  //     records[index] = {
  //       id: bet.recordId,
  //       auto: !!bet.auto,
  //       amount: parseFloat(bet.amount),
  //     };
  //   });
  // }
}
