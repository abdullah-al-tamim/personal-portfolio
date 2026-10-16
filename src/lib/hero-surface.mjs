// A coherent point surface, not independently wandering particles.
// Bounds keep the cursor response small even when the two wave centres overlap.
export function surfacePoint(x, y, focus, trail, time, radius) {
  const dx = x - focus.x,
    dy = y - focus.y;
  const d = Math.hypot(dx, dy),
    q = d / radius;
  const body = Math.exp(-q * q * 1.6);
  const tx = x - trail.x,
    ty = y - trail.y;
  const tq = Math.hypot(tx, ty) / radius;
  const wake = Math.exp(-tq * tq * 1.8);
  const breath = 0.91 + 0.09 * Math.sin(time * 1.7 - q * 2.2);
  const depth = Math.min(1, body * 0.78 * breath + wake * 0.3);
  const ripple = Math.sin(q * 4 - time * 1.4) * Math.exp(-q * q * 0.75) * 3;
  const amount = depth * 22 + ripple;
  return {
    x:
      x +
      (dx / Math.max(d, 1)) * amount +
      Math.max(-70, Math.min(70, focus.x - trail.x)) * depth * 0.045,
    y:
      y +
      (dy / Math.max(d, 1)) * amount +
      Math.max(-70, Math.min(70, focus.y - trail.y)) * depth * 0.045,
    size: 0.24 + depth * 1.65,
    angle: Math.atan2(dy, dx) + Math.PI / 2,
    alpha: 0.12 + depth * 0.65,
    hue: (Math.atan2(dy, dx) / Math.PI + 1) / 2,
    depth,
  };
}
