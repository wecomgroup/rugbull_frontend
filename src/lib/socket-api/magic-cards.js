import { socketStore } from "$lib/stores";

export class MagicCardAPI {
  /**
   * 
   * @returns {Promise<{
   *  cards: MagicCard.Card[]
   * }>}
   */
  static list() {
    return socketStore.wrapEmit("/v1/magicCard.php/cards", {});
  }

  static buy({ cardId }) {
    return socketStore.wrapEmit("/v1/magicCard.php/buy", { cardId });
  }

  /**
   * @returns {Promise<MagicCard.ActiveBuffResponse>}
   */
  static listActive() {
    return socketStore.wrapEmit("/v1/magicCard.php/user/activeBuffs", {});
  }
}
