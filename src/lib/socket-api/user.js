import { socketStore } from "$lib/stores";

export class UserAPI {
  /**
   * 
   * @returns {Promise<RugbullAPI.InitEvent>}
   */
  static getInit(){
    return socketStore.wrapEmit("/v1/users.php/init", {});
  }
}