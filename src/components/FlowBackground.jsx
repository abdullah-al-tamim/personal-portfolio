"use client";
import { useEffect, useRef } from "react";
import { surfacePoint } from "@/lib/hero-surface.mjs";

export default function FlowBackground({ paused }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current,
      ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      time = 0,
      points = [];
    const pointer = { x: 0, y: 0, active: false };
    const focus = { x: 0, y: 0 },
      trail = { x: 0, y: 0 };
    const colors = ["#723bfa", "#9870ff", "#b9f500", "#723bfa", "#b9f500"];
    function draw(now = 0) {
      frame = 0;
      const moving = !paused && !reduced.matches && !document.hidden;
      const dt = moving ? Math.min(now - last || 16, 32) / 1000 : 0;
      last = now;
      time += dt;
      const target =
        pointer.active && fine.matches
          ? pointer
          : {
              x: width * (0.55 + 0.12 * Math.sin(time * 0.66)),
              y: height * (0.51 + 0.09 * Math.cos(time * 0.75)),
            };
      const follow = 1 - Math.exp(-(pointer.active ? 1.2 : 0.6) * dt),
        lag = 1 - Math.exp(-0.9 * dt);
      focus.x += (target.x - focus.x) * follow;
      focus.y += (target.y - focus.y) * follow;
      trail.x += (focus.x - trail.x) * lag;
      trail.y += (focus.y - trail.y) * lag;
      ctx.clearRect(0, 0, width, height);
      // Keep the breathing bubble compact around the pointer.
      const radius = Math.min(width * 0.17, height * 0.15, 110);
      for (const p of points) {
        const a = surfacePoint(p.x, p.y, focus, trail, time, radius);
        const neon = p.neon;
        ctx.globalAlpha = neon ? Math.max(0.55, a.alpha) : a.alpha;
        ctx.fillStyle =
          a.depth > 0.09
            ? colors[Math.min(4, Math.floor(a.hue * 5))]
            : neon ? p.color : "#91859f";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = a.depth > 0.09 ? 12 : neon ? 5 : 0;
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          neon ? Math.max(0.85, a.size) : a.size,
          Math.max(neon ? 0.5 : 0.22, a.size * 0.43),
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
      }
      if (moving) frame = requestAnimationFrame(draw);
    }
    function refresh() {
      cancelAnimationFrame(frame);
      last = 0;
      draw();
    }
    function resize() {
      width = document.documentElement.clientWidth;
      height = window.innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const spacing = Math.max(
        width < 650 ? 19 : 22,
        Math.sqrt((width * height) / 2500),
      );
      points = [];
      for (let y = -20; y < height + 20; y += spacing)
        for (let x = -20; x < width + 20; x += spacing) {
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const jitter = seed - Math.floor(seed);
          points.push({
            neon: jitter > 0.72,
            color: jitter > 0.86 ? "#b9f500" : "#9870ff",
            x: x + (jitter - 0.5) * spacing * 0.65,
            y: y + Math.sin(seed) * 0.5 * spacing * 0.65,
          });
        }
      focus.x = trail.x = width * 0.55;
      focus.y = trail.y = height * 0.51;
      refresh();
    }
    function move(e) {
      if (paused || reduced.matches || !fine.matches) return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }
    function leave() {
      pointer.active = false;
    }
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", refresh);
    fine.addEventListener("change", leave);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", refresh);
      fine.removeEventListener("change", leave);
    };
  }, [paused]);
  return <canvas ref={ref} className="flow-background" aria-hidden="true" />;
}
