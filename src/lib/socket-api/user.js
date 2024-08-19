import { createSocketHandler, socketStore } from "$lib/stores";

export class UserAPI {
  /**
   * 
   * @returns {Promise<RugbullAPI.InitEvent>}
   */
  static getInit(){
    return new Promise((resolve, reject) => {
      socketStore.socket.timeout(5000).emit(
        "/v1/users.php/init",
        {},
        createSocketHandler((/**@type {RugbullAPI.InitEvent}*/data) => {
          console.log("INIT", data)
          resolve(data);
        }),
      );
    })
  }
}