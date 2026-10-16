import test from "node:test";
import assert from "node:assert/strict";
import { surfacePoint } from "../src/lib/hero-surface.mjs";
test("overlapping waves keep marks tiny and deformation bounded", () => {
  for (let x = 0; x < 1400; x += 29)
    for (let y = 0; y < 900; y += 29) {
      const p = surfacePoint(
        x,
        y,
        { x: 700, y: 450 },
        { x: 650, y: 410 },
        4,
        235,
      );
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
      assert.ok(p.size <= 1.9 && p.alpha <= 0.78);
      assert.ok(Math.hypot(p.x - x, p.y - y) < 30);
    }
});
test("stationary cursor retains a gentle pulse; remote points stay quiet", () => {
  const f = { x: 600, y: 400 };
  assert.notEqual(
    surfacePoint(650, 430, f, f, 0, 200).x,
    surfacePoint(650, 430, f, f, 1, 200).x,
  );
  const far = surfacePoint(0, 0, f, f, 1, 200);
  assert.ok(far.size < 0.25);
  assert.ok(Math.hypot(far.x, far.y) < 0.1);
});
