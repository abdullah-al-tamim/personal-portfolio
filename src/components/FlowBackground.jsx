"use client";
import { useEffect, useRef } from "react";

// Conceptual automation: incoming records straighten into lanes, pass gates,
// then leave as uniform output. No real system activity or personal data.
export default function FlowBackground({ paused }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current,
      ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      time = 0;
    const target = { x: -1000, y: -1000 },
      cursor = { x: -1000, y: -1000 };
    function pathY(x, lane, lanes) {
      const base = height * (0.23 + (lane * 0.55) / Math.max(1, lanes - 1));
      const entry = Math.max(0, 1 - x / (width * 0.4));
      return (
        base + Math.sin((x / width) * 8 + lane * 1.8) * entry * height * 0.075
      );
    }
    function draw(now = 0) {
      const active = !paused && !reduced.matches && !document.hidden;
      const dt = active ? Math.min(now - last || 16, 32) / 1000 : 0;
      time += dt;
      last = now;
      const ease = 1 - Math.exp(-5 * dt);
      cursor.x += (target.x - cursor.x) * ease;
      cursor.y += (target.y - cursor.y) * ease;
      ctx.clearRect(0, 0, width, height);
      const lanes = width < 650 ? 3 : 5;
      for (let lane = 0; lane < lanes; lane++) {
        ctx.beginPath();
        for (let x = -10; x <= width + 10; x += 8) {
          const y = pathY(x, lane, lanes);
          if (x === -10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(65,91,78,.15)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        for (const gate of [0.4, 0.7]) {
          const x = width * gate,
            y = pathY(x, lane, lanes);
          const hover = Math.max(
            0,
            1 - Math.hypot(x - cursor.x, y - cursor.y) / 130,
          );
          ctx.fillStyle = "rgba(240,241,237,.95)";
          ctx.fillRect(x - 9, y - 9, 18, 18);
          ctx.strokeStyle = "rgba(166,70,40," + (0.26 + hover * 0.35) + ")";
          ctx.lineWidth = 1 + hover;
          ctx.strokeRect(x - 9, y - 9, 18, 18);
          ctx.beginPath();
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x - 1, y + 3);
          ctx.lineTo(x + 4, y - 3);
          ctx.stroke();
        }
        for (let n = 0; n < 4; n++) {
          const x =
            ((time * (24 + lane * 2) + (n * width) / 4 + lane * 43) %
              (width + 40)) -
            20;
          const y = pathY(x, lane, lanes);
          const processed = x > width * 0.7;
          ctx.save();
          ctx.translate(x, y);
          if (x < width * 0.4)
            ctx.rotate(Math.sin(n + lane) * 0.5 * (1 - x / (width * 0.4)));
          ctx.fillStyle = processed
            ? "rgba(48,91,72,.57)"
            : "rgba(181,68,37,.46)";
          ctx.fillRect(-3, -2, processed ? 6 : 9, 4);
          if (processed) {
            ctx.fillStyle = "rgba(48,91,72,.22)";
            ctx.fillRect(-3, 5, 6, 1);
          }
          ctx.restore();
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
      if (fine.matches && !paused && !reduced.matches) {
        target.x = e.clientX;
        target.y = e.clientY;
      }
    }
    function leave() {
      target.x = -1000;
      target.y = -1000;
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
