import {writable} from 'svelte/store';
import {createSocketHandler} from "$lib/stores/socket.js";
import dayjs from "dayjs";

export const user = writable({
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
  socket.on("disconnect", () => {
    user.set(null)
  })

  socket.on("balanceEvent", (event) => {
    console.log("EVENT balanceEvent", event);
    if (event.coinType === 1) {
      user.update((u) => {
        u.energy = event.currentEnergy;
        return u;
      })
    } else if (event.coinType === 2) {
      user.update((u) => {
        u.bonus = parseFloat(event.currentBonus);
        return u;
      })
    }
  });

  socket.timeout(5000).emit(
    "/v1/users.php/init",
    {},
    createSocketHandler((/**@type {RugbullAPI.InitEvent}*/event) => {
      console.log("INIT", event);
      updateFromInitEvent(event);
    }),
  );
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

  user.set({
    login: true,
    userId,
    energy,
    bonus,
    energyPerSecond,
    maxEnergy,
  });

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
