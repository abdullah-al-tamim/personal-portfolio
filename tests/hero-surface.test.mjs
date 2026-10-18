import test from "node:test";
import assert from "node:assert/strict";
import { surfacePoint } from "../src/lib/hero-surface.mjs";
test("ring marks stay small and deformation bounded at every phase", () => {
  for (let t = 0; t < 8; t += 0.5)
    for (let x = 0; x < 1400; x += 29)
      for (let y = 0; y < 900; y += 29) {
        const p = surfacePoint(
          x,
          y,
          { x: 700, y: 450 },
          { x: 650, y: 410 },
          t,
          350,
        );
        assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
        assert.ok(p.size <= 1.9 && p.alpha <= 0.78);
        assert.ok(Math.hypot(p.x - x, p.y - y) < 30);
      }
});
test("bright rim surrounds a quiet centre and keeps breathing without pointer movement", () => {
  const f = { x: 600, y: 400 };
  const centre = surfacePoint(600, 400, f, f, 0, 200);
  const rim = surfacePoint(816, 400, f, f, 0, 200);
  assert.ok(rim.depth > centre.depth * 3);
  assert.notEqual(rim.x, surfacePoint(816, 400, f, f, 1, 200).x);
  const far = surfacePoint(0, 0, f, f, 1, 200);
  assert.ok(far.size < 0.25);
});
