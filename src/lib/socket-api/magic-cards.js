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
          console.log('BUY', event.cardId, event.newBalance);
          resolve(event);
        }),
      );
    });
  }
}