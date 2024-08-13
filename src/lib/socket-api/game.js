import { createSocketHandler, socket } from "$lib/stores";

export class GameAPI {
  /**
   * @returns {Promise<RugbullAPI.ResultEvent>}
   */
  static getGameResults() {
    return new Promise((resolve) => {
      socket.timeout(5000).emit(
        "/v1/games.php/result",
        {
          limit: 20,
          page: 1,
        },
        createSocketHandler((event) => {
          console.log("GAME RESULTS", event);
          resolve(event);
        }),
      );
    })
  }

  /**
   * @returns {Promise<RugbullAPI.GameEvent>}
   */
  static getGameInfo() {
    return new Promise((resolve) => {
      socket.timeout(5000).emit(
        "/v1/games.php/info",
        {},
        createSocketHandler((data) => {
          console.log("GAME INFO", data);
          resolve(data);
        }),
      );
    });
  }

  /**
   * @returns  {Promise<RugbullAPI.HistoryEvent>}
   */
  static getHistory({ limit, page }) {
    return new Promise((resolve) => {
      socket.timeout(5000).emit(
        "/v1/games.php/history",
        { limit, page },
        createSocketHandler((data) => {
          console.log("GAME HISTORY", data);
          resolve(data);
        }),
      );
    });
  }
}