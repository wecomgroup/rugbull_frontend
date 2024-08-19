import { socketStore } from "$lib/stores";

export class GameAPI {
  /**
   * @returns {Promise<RugbullAPI.ResultEvent>}
   */
  static getGameResults() {
    return socketStore.wrapEmit("/v1/games.php/result", {
      limit: 20,
      page: 1,
    });
  }

  /**
   * @returns {Promise<RugbullAPI.GameEvent>}
   */
  static getGameInfo() {
    return socketStore.wrapEmit("/v1/games.php/info", {});
  }

  /**
   * @returns  {Promise<RugbullAPI.HistoryEvent>}
   */
  static getHistory({ limit, page }) {
    return socketStore.wrapEmit("/v1/games.php/history", { limit, page });
  }

  /**
   * @returns {Promise<RugbullAPI.WebConfigEvent>} 
   */
  static getWebConfig() {
    return socketStore.wrapEmit("/v1/index.php/webconfig", {})
  }

  static cashout({recordId}){
    return socketStore.wrapEmit("/v1/games.php/cashout", {recordId});
  }
}