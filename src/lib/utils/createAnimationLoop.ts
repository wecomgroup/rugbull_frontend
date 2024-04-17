/**
 * `startLoop` and `stopLoop` can be used when onMount()
 */
export default function (callback:
  (props: { t: number, dt: number, frame: number }) =>
    void | { shouldStop?: boolean }) {
  let lastT = performance.now();
  let currentAnimationFrame: number | null = null;
  let frame = 0;

  function loop(t: number) {
    const dt = Math.min(100, t - lastT);
    frame++;
    lastT = t;
    const shouldStop = callback({ t, dt, frame })

    if (!shouldStop) {
      currentAnimationFrame = requestAnimationFrame(loop);
    }
  }

  function startLoop() {
    currentAnimationFrame && cancelAnimationFrame(currentAnimationFrame);
    requestAnimationFrame(loop)
  }

  function stopLoop() {
    currentAnimationFrame && cancelAnimationFrame(currentAnimationFrame);

  }

  return { startLoop, stopLoop }
}