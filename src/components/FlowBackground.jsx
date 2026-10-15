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
    const staticOnly = () => paused || reduced.matches || !fine.matches;
    function paint(time = 0) {
      frame = 0;
      const moving = !staticOnly() && visible && !document.hidden;
      if (moving) tick += Math.min(time - previous || 16, 32) * 0.001;
      previous = time;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        const wave = Math.sin(p.y * 0.008 + tick * 0.23 + p.phase);
        const baseX = p.x + wave * 14;
        const baseY = p.y + Math.cos(p.x * 0.006 + tick * 0.17 + p.phase) * 11;
        const dx = baseX - pointer.x,
          dy = baseY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const force = moving ? Math.max(0, 1 - distance / 180) : 0;
        const targetX = distance > 0 ? (dx / distance) * force * 48 : 0;
        const targetY = distance > 0 ? (dy / distance) * force * 48 : 0;
        p.ox += (targetX - p.ox) * 0.08;
        p.oy += (targetY - p.oy) * 0.08;
        ctx.save();
        ctx.translate(baseX + p.ox, baseY + p.oy);
        ctx.rotate(wave * 0.4 + force * 0.8);
        ctx.fillStyle = i % 6 === 0 ? "#c63920" : "#68756a";
        ctx.globalAlpha = (i % 6 === 0 ? 0.25 : 0.19) + force * 0.25;
        ctx.fillRect(0, 0, p.size, 1.2);
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
      const count = Math.min(210, Math.round((width * height) / 6500));
      particles = Array.from({ length: count }, (_, i) => ({
        x: (((i * 137.508) % 997) / 997) * width,
        y: (((i * 83.731) % 991) / 991) * height,
        phase: i * 0.73,
        size: 2 + (i % 4),
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
