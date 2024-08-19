import { io } from "socket.io-client";
import { userStore } from "$lib/stores/_user.js";
import { _error } from "$lib/stores/_error.js";
import { PUBLIC_SOCKET_URL } from "$env/static/public";
import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { rugbullStore } from "$lib/stores/_rugbull.js";
import { betStore } from "./_bet";

class SocketStore {
  /** @type import("socket.io-client").Socket */
  socket

  socketConnected = writable(false)
  error = writable(null)

  initSocket() {
    if (!browser) throw new Error("Cannot init socket on server side")

    if (this.socket != null) {
      console.log("Socket already initialized");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found in local storage")

    this.socket = io(PUBLIC_SOCKET_URL, {
      extraHeaders: {
        Authorization: token,
      },
    });

    userStore.subscribe()
    rugbullStore.subscribe()
    betStore.subscribe()

    this.socket.on("connect", () => {
      this.socketConnected.set(true);
    })
    this.socket.on("disconnect", () => {
      this.socketConnected.set(false);
    })
  }

  #checkError(err, response) {
    if (err) {
      this.error.set(err.toString());
      return err.toString();
    }
    if (response.ok === 0) {
      this.error.set(response.error.toString());
      return response.error.toString();
    }
    if (response.output?.payload?.statusCode >= 300) {
      this.error.set(response.output.payload.message);
      return response.output.payload.message;
    }
    if (response.statusCode >= 300) {
      this.error.set(response.message);
      return response.message;
    }
  }

  wrapEmit(path, payload) {
    return new Promise((resolve, reject) => {
      socketStore.socket
      .timeout(5000)
      .emit(path, payload, (err, response) => {
        const hasError = this.#checkError(err, response);
        if (hasError) {
          reject(hasError);
        }
        if (response.statusCode === 200) {
          const data = response.data;
          resolve(data);
        } else if (response.statusCode === 401) {
          // localStorage.removeItem("token");
          reject("Token expired");
        } else {
          console.error(`Unhandled response [${path}] `, response);
          reject("Unhandled response")
        }
      })
    })
  }
}

export const socketStore = new SocketStore();