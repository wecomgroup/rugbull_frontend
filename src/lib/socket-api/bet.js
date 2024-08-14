import { createSocketHandler, socketStore } from "$lib/stores";

export class BetAPI {
  static bet({
    round,
    coinType,
    auto,
    multiplier,
    amount
  }) {
    return new Promise((resolve) => {
      socketStore.socket.timeout(5000).emit(
        "/v1/games.php/bet",
        { round, coinType, auto, multiplier, amount },
        createSocketHandler((data) => {
          console.log("BET RESPONSE", data);
          resolve(data);
        }),
      );
    })
  }
}