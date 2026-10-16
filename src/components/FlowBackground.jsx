"use client";
import { useEffect, useRef } from "react";

// Ordered paths and travelling signals: decorative, viewport-sized, no WebGL.
export default function FlowBackground({ paused }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      time = 0;
    const target = { x: 0, y: 0, power: 0 },
      cursor = { x: 0, y: 0, power: 0 };
    const point = (x, line) => {
      const base = height * 0.12 + line * height * 0.065;
      const wave =
        Math.sin((x / width) * 5.4 + line * 0.16 + time * 0.16) *
        height *
        0.055;
      const bend =
        Math.exp(
          -(((x - cursor.x) / 150) ** 2) - ((base - cursor.y) / 180) ** 2,
        ) *
        cursor.power *
        18;
      return base + wave + bend;
    };
    function draw(now = 0) {
      const active = !paused && !reduced.matches && !document.hidden;
      const dt = active ? Math.min(now - last || 16, 32) / 1000 : 0;
      last = now;
      time += dt;
      const ease = 1 - Math.exp(-5 * dt);
      for (const k of ["x", "y", "power"])
        cursor[k] += (target[k] - cursor[k]) * ease;
      ctx.clearRect(0, 0, width, height);
      for (let line = 0; line < 12; line++) {
        ctx.beginPath();
        for (let x = -20; x <= width + 20; x += 12) {
          const y = point(x, line);
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          line % 4 === 0 ? "rgba(166,79,47,.16)" : "rgba(63,88,79,.12)";
        ctx.lineWidth = 0.65;
        ctx.stroke();
        for (let n = 0; n < 3; n++) {
          const x =
            ((time * (16 + line * 0.8) + (n * width) / 3 + line * 59) %
              (width + 40)) -
            20;
          const y = point(x, line),
            nextY = point(x + 7, line);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 7, nextY);
          ctx.strokeStyle =
            line % 4 === 0 ? "rgba(178,67,37,.5)" : "rgba(55,88,77,.38)";
          ctx.lineWidth = 1.7;
          ctx.stroke();
        }
      }
      frame = active ? requestAnimationFrame(draw) : 0;
    }
    function refresh() {
      cancelAnimationFrame(frame);
      last = 0;
      draw();
    }
    function resize() {
      width = innerWidth;
      height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      refresh();
    }
    function move(e) {
      if (!fine.matches) return;
      target.x = e.clientX;
      target.y = e.clientY;
      target.power = 1;
    }
    function leave() {
      target.power = 0;
    }
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", refresh);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", refresh);
    };
  }, [paused]);
  return <canvas ref={ref} className="flow-background" aria-hidden="true" />;
}
