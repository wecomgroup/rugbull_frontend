import {writable} from "svelte/store";
import {isBrowser} from "$lib";

export const soundOn = writable(true)
let loaded;

soundOn.subscribe((value) => {
  if (!loaded) return
  if (value) {
    isBrowser() && localStorage.setItem("soundOn", "true")
  } else {
    isBrowser() && localStorage.setItem("soundOn", "false")
  }
})

export function loadSettings(){
  loaded = true
  const soundOnValue = isBrowser() && localStorage.getItem("soundOn")
  if (soundOnValue === "false") {
    soundOn.set(false)
  } else {
    soundOn.set(true)
  }
}