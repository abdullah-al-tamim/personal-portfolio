"use client";
import { useEffect, useRef } from "react";

// Decorative, synthetic field. No tracking, assets, WebGL, or pointer interception.
export default function FlowBackground({ paused }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas;
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
    const pointer = { x: 0, y: 0, active: false };
    const lens = { x: 0, y: 0, strength: 0 };
    const staticOnly = () => paused || reduced.matches;
    function paint(time = 0) {
      frame = 0;
      const moving = !staticOnly() && visible && !document.hidden;
      const delta = moving ? Math.min(time - previous || 16, 32) * 0.001 : 0;
      tick += delta;
      previous = time;
      ctx.clearRect(0, 0, width, height);
      const ease = 1 - Math.exp(-4.5 * delta);
      lens.x += (pointer.x - lens.x) * ease;
      lens.y += (pointer.y - lens.y) * ease;
      lens.strength +=
        ((pointer.active && fine.matches ? 1 : 0) - lens.strength) * ease;
      const radius = Math.min(width * 0.16, 150);
      // Rounded lenses inflate a shared point field. A moving focus trails the
      // pointer; two slower foci keep the surface breathing while unattended.
      const bubbles = [
        {
          x: width * (0.28 + Math.sin(tick * 0.22) * 0.18),
          y: height * (0.3 + Math.cos(tick * 0.27) * 0.1),
          r: radius * (1 + Math.sin(tick * 0.55) * 0.07),
          strength: 0.65,
        },
        {
          x: width * (0.73 + Math.cos(tick * 0.19) * 0.16),
          y: height * (0.38 + Math.sin(tick * 0.24) * 0.15),
          r: radius * 0.85,
          strength: 0.55,
        },
        {
          x: lens.x,
          y: lens.y,
          r: Math.min(width * 0.12, 115),
          strength: lens.strength * 0.65,
        },
      ];
      particles.forEach((p) => {
        const baseX = p.x + Math.sin(tick * 0.25 + p.y * 0.004) * 2;
        const baseY = p.y + Math.cos(tick * 0.22 + p.x * 0.004) * 2;
        let x = baseX,
          y = baseY,
          depth = 0,
          angle = 0;
        for (const bubble of bubbles) {
          const dx = baseX - bubble.x,
            dy = baseY - bubble.y;
          const distance = Math.hypot(dx, dy);
          const q = distance / bubble.r;
          const influence = Math.exp(-q * q * 2) * bubble.strength;
          // Radial inflation plus a small tangent displacement gives a soft
          // spherical edge rather than a flat wave or a scattered swarm.
          x += dx * influence * 0.28 - dy * influence * 0.025;
          y += dy * influence * 0.28 + dx * influence * 0.025;
          depth = Math.max(depth, influence);
          angle += Math.atan2(dy, dx) * influence;
        }
        const size = 0.45 + Math.min(depth, 0.7) * 1.8;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + p.rotation);
        ctx.fillStyle =
          depth < 0.12
            ? "#53625b"
            : ["#4269a2", "#b84531", "#a88b37", "#536e63"][p.color];
        ctx.globalAlpha = 0.2 + Math.min(depth, 0.7) * 0.48;
        ctx.beginPath();
        ctx.ellipse(0, 0, size, Math.max(0.4, size * 0.45), 0, 0, Math.PI * 2);
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
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const spacing = Math.max(
        fine.matches ? 22 : 28,
        Math.sqrt((width * height) / 2800),
      );
      const columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      particles = Array.from(
        { length: Math.min(columns * rows, 3500) },
        (_, i) => ({
          x: (i % columns) * spacing - spacing / 2,
          y: Math.floor(i / columns) * spacing - spacing / 2,
          rotation: 0,
          color: Math.floor(i / columns / 5) % 4,
        }),
      );
      if (!pointer.active) {
        pointer.x = lens.x = width * 0.65;
        pointer.y = lens.y = height * 0.35;
      }
      refresh();
    }
    function move(event) {
      if (staticOnly()) return;
      const rect = host.getBoundingClientRect();
      pointer.active = true;
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }
    function leave() {
      pointer.active = false;
    }
    const resizeObserver = new ResizeObserver(resize);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    resizeObserver.observe(host);
    observer.observe(host);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", refresh);
    fine.addEventListener("change", refresh);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", refresh);
      fine.removeEventListener("change", refresh);
    };
  }, [paused]);
  return (
    <canvas className="flow-background" ref={canvasRef} aria-hidden="true" />
  );
}
