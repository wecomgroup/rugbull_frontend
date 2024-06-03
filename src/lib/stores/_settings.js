import {writable} from "svelte/store";
import {isBrowser} from "$lib";

export const soundOn = writable(true)
let loaded;

soundOn.subscribe((value) => {
  if (!loaded) return
  if (value) {
    isBrowser() && localStorage.setItem("soundOn", "true")
    console.log("soundOn", value)
  } else {
    isBrowser() && localStorage.setItem("soundOn", "false")
    console.log("soundOn", value)
  }
})

export function loadSettings(){
  loaded = true
  const soundOnValue = isBrowser() && localStorage.getItem("soundOn")
  console.log("soundOnValue", soundOnValue);
  if (soundOnValue === "false") {
    soundOn.set(false)
  } else {
    soundOn.set(true)
  }
}