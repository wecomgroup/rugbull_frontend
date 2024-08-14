import { socket, createSocketHandler } from "$lib/stores";

export class MagicCardAPI {
  /**
   * 
   * @returns {Promise<{
   *  cards: MagicCard.Card[]
   * }>}
   */
  static list() {
    return new Promise((resolve, reject) => {
      socket.timeout(5000).emit(
        "/v1/magicCard.php/cards",
        {},
        createSocketHandler((event) => {
          resolve(event);
        }),
      );
    });
  }

  static buy({ cardId }) {
    return new Promise((resolve, reject) => {
      socket.timeout(5000).emit(
        "/v1/magicCard.php/buy",
        {
          cardId,
        },
        createSocketHandler((/** @type {MagicCard.BuyResponse} */event) => {
          console.log('CARD BUY', event.cardId, event.newBalance);
          resolve(event);
        }),
      );
    });
  }

  /**
   * @returns {Promise<MagicCard.ActiveBuffResponse>}
   */
  static listActive() {
    return new Promise((resolve, reject) => {
      socket.timeout(5000).emit(
        "/v1/magicCard.php/user/activeBuffs",
        {},
        createSocketHandler((event) => {
          resolve(event);
        }),
      );
    })
  }
}
