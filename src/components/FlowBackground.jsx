"use client";
import { useEffect, useRef } from "react";
import { surfacePoint } from "@/lib/hero-surface.mjs";

export default function FlowBackground({ paused }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current,
      host = canvas?.parentElement,
      ctx = canvas?.getContext("2d");
    if (!ctx || !host) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      time = 0,
      visible = true,
      points = [];
    const pointer = { x: 0, y: 0, active: false };
    const focus = { x: 0, y: 0 },
      trail = { x: 0, y: 0 };
    const colors = ["#4667dd", "#7160ca", "#ad5288", "#d26859", "#c9a03a"];
    function draw(now = 0) {
      frame = 0;
      const moving = !paused && !reduced.matches && visible && !document.hidden;
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
      const radius = Math.min(width * 0.48, height * 0.43);
      for (const p of points) {
        const a = surfacePoint(p.x, p.y, focus, trail, time, radius);
        // Fade only at the hero's lower boundary; never cover sections below it.
        const fade = Math.min(1, Math.max(0, (height - a.y) / (height * 0.18)));
        ctx.globalAlpha = a.alpha * fade;
        ctx.fillStyle =
          a.depth > 0.09
            ? colors[Math.min(4, Math.floor(a.hue * 5))]
            : "#87918b";
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          a.size,
          Math.max(0.22, a.size * 0.43),
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
      width = host.clientWidth;
      height = Math.min(host.clientHeight, innerHeight * 1.05);
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
      const rect = host.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = Math.min(height, Math.max(0, e.clientY - rect.top));
      pointer.active = e.clientY - rect.top <= height;
    }
    function leave() {
      pointer.active = false;
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    observer.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", refresh);
    fine.addEventListener("change", leave);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", refresh);
      fine.removeEventListener("change", leave);
    };
  }, [paused]);
  return <canvas ref={ref} className="flow-background" aria-hidden="true" />;
}
