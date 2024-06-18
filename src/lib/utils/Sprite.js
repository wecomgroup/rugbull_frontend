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

  constructor(src, {rows = 1, columns = 1, fps = 4}) {
    this.#rows = rows;
    this.#columns = columns;
    this.#fps = fps;
    this.#startTime = Date.now();

    if (isBrowser()) {
      loadImage(src)
        .then(({image}) => {
          this.#img = image;
        })
    }
  }

  #width() {
    return this.#img?.width;
  }

  imageHeight() {
    return this.#img?.height;
  }

  #getFrame(t) {
    const diff = t - this.#startTime;
    let frame = Math.floor(this.#fps * diff / 1000);
    frame = frame % (this.#rows * this.#columns);
    return frame;
  }

  frameHeight() {
    return this.#img ? this.imageHeight() / this.#rows : 0;
  }

  frameWidth() {
    return this.#width() / this.#columns;
  }

  heightOf(w) {
    return w * this.frameHeight() / this.frameWidth();
  }
  widthOf(h) {
    return h * this.frameWidth() / this.frameHeight();
  }

  /**
   *
   * @param ctx {CanvasRenderingContext2D}
   * @param x {number}
   * @param y {number}
   * @param dw {number}
   * @param [dh] {number}
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

  drawStatic(ctx, x, y, dw, dh) {
    this.draw(ctx, 0, x, y, dw, dh);
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
