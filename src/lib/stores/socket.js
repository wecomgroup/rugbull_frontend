import {io} from "socket.io-client";
import {subscribeUser} from "$lib/stores/_user.js";
import {_error} from "$lib/stores/_error.js";

/** @type import("socket.io-client").Socket */
let socket

export function getSocket(){
  if (socket != null){
    return socket
  }

  const token = localStorage.getItem("token");

  if (token == null){
    return null
  }

  console.log("Creating socket with token");

  socket = io("https://api.rugbull.io", {
    extraHeaders: {
      Authorization: token,
    },
  });

  socket.on("connect", () => {
    subscribeUser(socket)
  })

  return socket;
}

function checkError(err, response) {
  if (err) {
    console.error(err);
    return true;
  }
  if (response.ok === 0) {
    _error.set( response.error);
    return true;
  }
  if (response.output?.payload?.statusCode >= 300) {
    _error.set( response.output.payload.message);
    return true;
  }
  if (response.statusCode >= 300) {
    console.log("ERROR", response);
    _error.set( response.message);
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
      socket?.close();
    } else {
      console.log("UNHANDLED EVENT", event);
    }
  };
}
