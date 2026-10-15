"use client";
import { useEffect, useRef } from "react";

// Decorative, synthetic field. No tracking, assets, WebGL, or pointer interception.
export default function FlowBackground({ paused }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!host || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0,
      visible = true,
      width = 0,
      height = 0,
      tick = 0,
      previous = 0;
    let particles = [];
    const pointer = { x: -1000, y: -1000 };
    const staticOnly = () => paused || reduced.matches;
    function paint(time = 0) {
      frame = 0;
      const moving = !staticOnly() && visible && !document.hidden;
      const delta = moving ? Math.min(time - previous || 16, 32) * 0.001 : 0;
      tick += delta;
      previous = time;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        // A continuous current remains alive without a pointer. Nearby marks
        // orbit a moving attractor, then relax back into the ambient field.
        const wave = Math.sin(p.y * 0.006 + tick * 0.65 + p.phase);
        const baseX = (p.x + tick * (10 + i % 9) + wave * 28) % (width + 40) - 20;
        const baseY = p.y + Math.cos(p.x * 0.004 + tick * 0.6 + p.phase) * 24;
        const dx = pointer.x - baseX, dy = pointer.y - baseY;
        const distance = Math.hypot(dx, dy);
        const force = moving && fine.matches ? Math.max(0, 1 - distance / 310) : 0;
        const orbit = tick * 1.1 + p.phase;
        const targetX = force * (dx * 0.72 + Math.cos(orbit) * 34);
        const targetY = force * (dy * 0.72 + Math.sin(orbit) * 34);
        const ease = 1 - Math.exp(-5 * delta);
        p.ox += (targetX - p.ox) * ease;
        p.oy += (targetY - p.oy) * ease;
        ctx.save();
        ctx.translate(baseX + p.ox, baseY + p.oy);
        ctx.rotate(wave + tick * 0.3 + force);
        ctx.fillStyle = i % 4 === 0 ? "#c63920" : "#52645a";
        ctx.globalAlpha = (i % 4 === 0 ? 0.65 : 0.42) + force * 0.25;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, 1.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      if (moving) frame = requestAnimationFrame(paint);
    }
    function refresh() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      paint();
    }
    function resize() {
      width = host.clientWidth;
      height = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(fine.matches ? 500 : 180, Math.round((width * height) / 2300));
      particles = Array.from({ length: count }, (_, i) => ({
        x: (((i * 137.508) % 997) / 997) * width,
        y: (((i * 83.731) % 991) / 991) * height,
        phase: i * 0.73,
        size: 1.4 + (i % 4) * 0.65,
        ox: 0,
        oy: 0,
      }));
      refresh();
    }
    function move(event) {
      if (staticOnly()) return;
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }
    function leave() {
      pointer.x = -1000;
      pointer.y = -1000;
    }
    const resizeObserver = new ResizeObserver(resize);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    resizeObserver.observe(host);
    observer.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", refresh);
    fine.addEventListener("change", refresh);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", refresh);
      fine.removeEventListener("change", refresh);
    };
  }, [paused]);
  return (
    <canvas className="flow-background" ref={canvasRef} aria-hidden="true" />
  );
}
