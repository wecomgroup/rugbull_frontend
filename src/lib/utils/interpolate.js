export function interpolateBezierCurve([x1, y1], [x2, y2], [x3, y3], t) {
  const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * x2 + t ** 2 * x3
  const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * y2 + t ** 2 * y3
  return {x, y}
}

export function interpolateLinear([x1, y1], [x2, y2], t) {
  const x = x1 + t * (x2 - x1)
  const y = y1 + t * (y2 - y1)
  return {x, y}
}

