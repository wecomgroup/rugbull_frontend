import {writable, type Writable} from 'svelte/store';
import isBrowser from "$lib/utils/isBrowser";

export default function (src: string) {
  if (isBrowser()) {
    const image = new Image();
    let imageLoaded = false;
    image.src = src
    image.onload = () => {
      imageLoaded = true;
      v.set({
        image,
        width: image.width,
        height: image.height,
      })
    };
  }

  const v = writable<{
    image: HTMLImageElement | null,
    width: number,
    height: number,
  }>({
    image: null,
    width: 0,
    height: 0,
  })
  return v
}