// place files you want to import through the `$lib` alias in this folder.
import Canvas from './components/Canvas/Canvas.svelte';
import loadImage from './utils/loadImage';
import isBrowser from './utils/isBrowser';
import createAnimationLoop  from "$lib/utils/createAnimationLoop";

export {
  Canvas,
  loadImage,
  isBrowser,
  createAnimationLoop
}
