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

  initSocket() {
    if (!browser) return null

    if (this.socket != null) return this.socket
    const token = localStorage.getItem("token");
    if (!token) return null

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
}

export const socketStore = new SocketStore();

function checkError(err, response) {
  if (err) {
    console.error(err);
    return true;
  }
  if (response.ok === 0) {
    _error.set(response.error);
    return true;
  }
  if (response.output?.payload?.statusCode >= 300) {
    _error.set(response.output.payload.message);
    return true;
  }
  if (response.statusCode >= 300) {
    console.log("ERROR", response);
    _error.set(response.message);
    return true;
  }
  return false;
}


/**
 *
 * @param callback {(function(*): void)}
 */
export function createSocketHandler(callback) {
  return (err, event) => {
    if (checkError(err, event)) {
      return;
    }
    if (event.statusCode === 200) {
      const data = event.data;
      callback(data);
    } else if (event.statusCode === 401) {
      console.log("TOKEN EXPIRED");
      localStorage.removeItem("token");
    } else {
      console.log("UNHANDLED EVENT", event);
    }
  };
}
