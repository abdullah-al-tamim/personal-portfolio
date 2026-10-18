// Original annular field: a narrow breathing rim, a soft shoulder, and radial marks.
export function surfacePoint(x, y, focus, trail, time, radius) {
  const dx = x - focus.x,
    dy = y - focus.y;
  const angle = Math.atan2(dy, dx),
    distance = Math.hypot(dx, dy);
  const breath = 1 + 0.14 * Math.sin(time) + 0.08 * Math.cos(time * 3);
  const warp =
    Math.sin(angle * 3 + time * 0.7) * 0.045 +
    Math.cos(angle * 5 - time * 0.43) * 0.025;
  const q = distance / radius,
    edge = q - breath - warp;
  const shoulder = Math.exp(-Math.pow(edge / 0.38, 2));
  const rim = Math.exp(-Math.pow(edge / 0.12, 2));
  const interior = Math.exp(-Math.pow(q / 0.9, 4));
  const texture =
    0.5 +
    0.5 *
      Math.sin(x * 0.018 + Math.cos(y * 0.016 + time * 0.4) * 2 + time * 0.6);
  const depth = Math.min(
    1,
    rim * 0.68 + shoulder * 0.22 + interior * texture * 0.12,
  );
  const displacement =
    rim * 17 + shoulder * Math.sin(angle * 4 + time * 1.2) * 4;
  return {
    x:
      x +
      Math.cos(angle) * displacement +
      Math.max(-40, Math.min(40, focus.x - trail.x)) * shoulder * 0.04,
    y:
      y +
      Math.sin(angle) * displacement +
      Math.max(-40, Math.min(40, focus.y - trail.y)) * shoulder * 0.04,
    size: 0.2 + depth * 1.55,
    angle: angle + Math.sin(x * 0.025 + y * 0.014 + time * 0.2) * 0.22,
    alpha: 0.13 + depth * 0.63,
    hue: 0.5 + 0.5 * Math.sin(x * 0.003 + y * 0.002 + time * 0.08),
    depth,
  };
}
