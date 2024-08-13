import { writable } from "svelte/store";


class UIStore {
  showNavbar = writable(true);

  toggleNavbar(show) {
    this.showNavbar.set(show);
  }
}

export const uiStore = new UIStore();