import {writable} from 'svelte/store';
import isBrowser from "$lib/utils/isBrowser";

/**
 * Left to right, top to bottom
 */
export class Sprite {
  #img;
  #rows
  #columns
  #startTime
  #fps

  constructor(src, {rows = 1, columns = 1, fps =15}) {
    this.#rows = rows;
    this.#columns = columns;
    this.#fps = fps;
    this.#startTime = Date.now();

    if (isBrowser()){
      loadImage(src)
        .then(({image}) => {
          this.#img = image;
        })
    }
  }

  #width() {
    return this.#img.width;
  }

  #height() {
    return this.#img.height;
  }

  #getFrame(t) {
    const diff = t - this.#startTime;
    let frame = Math.floor(this.#fps * diff / 1000);
    frame = frame % (this.#rows * this.#columns);
    return frame;
  }

  frameHeight(){
    return this.#height() / this.#rows;
  }
  frameWidth(){
    return this.#width() / this.#columns;
  }

  /**
   *
   * @param ctx {CanvasRenderingContext2D}
   * @param x
   * @param y
   * @param dw
   * @param dh
   */
  draw(ctx, t, x, y, dw, dh) {
    if (!this.#img) return;
    const frame = this.#getFrame(t);
    const row = Math.floor(frame / this.#columns);
    const column = frame % this.#columns;

    const sw = this.frameWidth()
    const sh = this.frameHeight()
    const sx = column * sw;
    const sy = row * sh;

    dh = dh ?? dw * sh / sw;

    ctx.drawImage(this.#img, sx, sy, sw, sh, x, y, dw, dh);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let imageLoaded = false;
    image.src = src
    image.onload = () => {
      imageLoaded = true;

      resolve({
        image
      })
    };
  })
}