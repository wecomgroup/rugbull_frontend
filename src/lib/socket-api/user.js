import { createSocketHandler, socket } from "$lib/stores";

export class UserAPI {
  /**
   * 
   * @returns {Promise<RugbullAPI.InitEvent>}
   */
  static getInit(){
    return new Promise((resolve, reject) => {
      socket.timeout(5000).emit(
        "/v1/users.php/init",
        {},
        createSocketHandler((/**@type {RugbullAPI.InitEvent}*/data) => {
          resolve(data);
        }),
      );
    })
  }
}