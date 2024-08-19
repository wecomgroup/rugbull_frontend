import { socketStore } from "$lib/stores";

export class BetAPI {
  static bet({
    round,
    coinType,
    auto,
    multiplier,
    amount
  }) {
    return socketStore.wrapEmit("/v1/games.php/bet", { round, coinType, auto, multiplier, amount });
  }
}