"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./PracticeCards.module.css";

const practices = [
  {
    title: "Automate the routine.",
    label: "01 / AUTOMATION & DEVELOPMENT",
    detail: "Reliable workflows. Less manual work.",
    tools: "Python · JavaScript · Retool · APIs",
    href: "#work",
    link: "Explore systems",
    shape: "code",
  },
  {
    title: "Make data useful.",
    label: "02 / DATA ENGINEERING",
    detail: "Connected sources. Clearer decisions.",
    tools: "SQL · StarRocks · PostgreSQL",
    href: "/work/architecture",
    link: "Explore the architecture",
    shape: "data",
  },
  {
    title: "Explore intelligence.",
    label: "03 / AI & RESEARCH",
    detail: "Learning from images and signals.",
    tools: "Machine learning · Computer vision · EEG",
    href: "#research",
    link: "Explore research",
    shape: "network",
  },
];

// Original point geometry. No images, fonts, or third-party animation assets.
function shapePoints(kind) {
  const points = [];
  function segment(x1, y1, x2, y2, n = 20) {
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      points.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
    }
  }
  function ellipse(x, y, rx, ry, n = 50) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      points.push({ x: x + Math.cos(a) * rx, y: y + Math.sin(a) * ry });
    }
  }
  if (kind === "code") {
    for (const sign of [-1, 1]) {
      const path = [
        [sign * 54, -58],
        [sign * 79, -58],
        [sign * 87, -45],
        [sign * 87, -18],
        [sign * 103, 0],
        [sign * 87, 18],
        [sign * 87, 45],
        [sign * 79, 58],
        [sign * 54, 58],
      ];
      path.slice(1).forEach((p, i) => segment(...path[i], ...p, 9));
    }
    segment(17, -36, -17, 36, 35);
  } else if (kind === "data") {
    [-44, 0, 44].forEach((y) => ellipse(0, y, 75, 20));
    segment(-75, -44, -75, 44, 30);
    segment(75, -44, 75, 44, 30);
  } else {
    const nodes = [
      [-85, -42],
      [-85, 42],
      [0, -58],
      [0, 0],
      [0, 58],
      [85, -36],
      [85, 36],
    ];
    for (let a = 0; a < 2; a++)
      for (let b = 2; b < 5; b++) segment(...nodes[a], ...nodes[b], 10);
    for (let a = 2; a < 5; a++)
      for (let b = 5; b < 7; b++) segment(...nodes[a], ...nodes[b], 10);
    nodes.forEach(([x, y]) => ellipse(x, y, 9, 9, 15));
  }
  return points;
}

function PracticeCard({ practice, paused }) {
  const host = useRef(null);
  const canvas = useRef(null);
  const savedProgress = useRef(0);
  const elapsed = useRef(0);
  useEffect(() => {
    const anchor = host.current,
      surface = canvas.current,
      ctx = surface.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const targets = shapePoints(practice.shape);
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      progress = savedProgress.current,
      hovered = anchor.matches(":hover"),
      focused = document.activeElement === anchor,
      visible = false;
    let pointer = null;
    const desired = () =>
      reduced.matches || hovered || focused || elapsed.current % 8 < 5 ? 1 : 0;
    function draw(now = 0) {
      frame = 0;
      const dt = Math.min((now - last || 16) / 1000, 0.04);
      last = now;
      if (!paused && !reduced.matches) elapsed.current += dt;
      const target = desired();
      if (reduced.matches) progress = 1;
      else if (!paused)
        progress += (target - progress) * (1 - Math.exp(-5 * dt));
      if (Math.abs(target - progress) < 0.002) progress = target;
      savedProgress.current = progress;
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width / 340, height / 180);
      targets.forEach((point, i) => {
        const rawX = ((Math.sin(i * 127.1) * 43758.5453) % 1) * width * 0.46;
        const rawY = ((Math.cos(i * 311.7) * 19231.123) % 1) * height * 0.43;
        let x = width / 2 + rawX * (1 - progress) + point.x * scale * progress;
        let y = height / 2 + rawY * (1 - progress) + point.y * scale * progress;
        if (pointer && fine.matches && !reduced.matches && !paused) {
          const dx = x - pointer.x,
            dy = y - pointer.y,
            distance = Math.hypot(dx, dy);
          if (distance < 45 && distance > 0) {
            const force = (1 - distance / 45) * 8;
            x += (dx / distance) * force;
            y += (dy / distance) * force;
          }
        }
        ctx.fillStyle = progress > 0.5 ? "#b9f500" : "#a587f6";
        ctx.globalAlpha = 0.35 + 0.5 * progress;
        ctx.beginPath();
        ctx.arc(x, y, (0.7 + 0.55 * progress) * scale, 0, Math.PI * 2);
        ctx.fill();
      });
      if (visible && !document.hidden && !paused && !reduced.matches)
        frame = requestAnimationFrame(draw);
    }
    function refresh() {
      cancelAnimationFrame(frame);
      last = 0;
      if (visible && !document.hidden) draw();
    }
    function resize() {
      width = surface.clientWidth;
      height = surface.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      surface.width = width * dpr;
      surface.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      refresh();
    }
    const enter = () => {
      hovered = true;
      refresh();
    };
    const leave = () => {
      hovered = false;
      pointer = null;
      refresh();
    };
    const focus = () => {
      focused = true;
      refresh();
    };
    const blur = () => {
      focused = false;
      refresh();
    };
    const move = (event) => {
      if (!fine.matches || paused || reduced.matches) return;
      const r = surface.getBoundingClientRect();
      pointer = { x: event.clientX - r.left, y: event.clientY - r.top };
      refresh();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    observer.observe(anchor);
    const resizer = new ResizeObserver(resize);
    resizer.observe(surface);
    anchor.addEventListener("pointerenter", enter);
    anchor.addEventListener("pointerleave", leave);
    anchor.addEventListener("pointermove", move);
    anchor.addEventListener("focus", focus);
    anchor.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", refresh);
    fine.addEventListener("change", refresh);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      anchor.removeEventListener("pointerenter", enter);
      anchor.removeEventListener("pointerleave", leave);
      anchor.removeEventListener("pointermove", move);
      anchor.removeEventListener("focus", focus);
      anchor.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", refresh);
      fine.removeEventListener("change", refresh);
    };
  }, [practice.shape, paused]);
  return (
    <Link ref={host} href={practice.href} className={styles.card}>
      <canvas ref={canvas} aria-hidden="true" />
      <span className={styles.label}>{practice.label}</span>
      <h3>{practice.title}</h3>
      <p>{practice.detail}</p>
      <span className={styles.tools}>{practice.tools}</span>
      <span className={styles.link}>
        {practice.link}
        <span aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}

export default function PracticeCards({ paused }) {
  return (
    <div className={styles.cards}>
      {practices.map((practice) => (
        <PracticeCard
          key={practice.shape}
          practice={practice}
          paused={paused}
        />
      ))}
    </div>
  );
}
