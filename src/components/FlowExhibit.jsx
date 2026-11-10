"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FlowExhibit.module.css";

const records = Array.from({ length: 18 }, (_, i) => ({
  x: 65 + ((i * 137) % 800),
  y: 35 + ((i * 71) % 190),
  angle: ((i % 7) - 3) * 9,
}));
const stages = [
  ["Messy inputs.", "Different sources. One starting point."],
  ["Connected.", "Scattered records find their place."],
  ["Checked.", "Catch the exception. Keep the flow."],
  ["Ready to build.", "Clean data becomes something useful."],
];

export default function FlowExhibit({ paused = false }) {
  const host = useRef(null);
  const [replay, setReplay] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const inView = useRef(false);

  useEffect(() => {
    const element = host.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      element.dataset.reduced = String(reduced.matches);
      element.style.setProperty(
        "--flow-play",
        visible && !document.hidden && !paused && !stopped && !reduced.matches
          ? "running"
          : "paused",
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
        if (visible && !inView.current && !paused && !stopped && !reduced.matches) {
          setReplay((value) => value + 1);
          setCompleted(false);
        }
        inView.current = visible;
        update();
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [paused, stopped]);

  return (
    <figure
      id="fragment-to-flow"
      ref={host}
      className={styles.exhibit}
      aria-label="From fragment to flow: an illustrative data pipeline"
    >
      <div className={styles.top}>
        <span className="micro">FIG. 01 / FROM FRAGMENT TO FLOW</span>
        <div className={styles.controls}>
          <button
            disabled={paused || completed}
            aria-pressed={stopped || paused}
            onClick={() => setStopped(!stopped)}
          >
            {paused ? "Motion paused" : completed ? "Complete" : stopped ? "Play" : "Pause"}
          </button>
          <button
            disabled={paused}
            onClick={() => {
              setReplay((value) => value + 1);
              setCompleted(false);
              setStopped(false);
            }}
          >
            Replay <span aria-hidden="true">↻</span>
          </button>
        </div>
      </div>
      <div key={replay} className={styles.sequence} onAnimationEnd={(event) => {
        if (event.target.dataset.finish === "true") setCompleted(true);
      }}>
        <svg className={styles.scene} viewBox="0 0 1000 300" aria-hidden="true">
          <g className={styles.grid}>
            {Array.from({ length: 120 }, (_, i) => (
              <circle
                key={i}
                cx={35 + (i % 30) * 32}
                cy={45 + Math.floor(i / 30) * 65}
                r="1"
              />
            ))}
          </g>
          {records.map((record, i) => (
            <g
              key={i}
              className={`${styles.record} ${i === 10 ? styles.exception : ""}`}
              style={{
                "--raw-x": `${record.x}px`,
                "--raw-y": `${record.y}px`,
                "--angle": `${record.angle}deg`,
                "--grid-x": `${190 + (i % 6) * 100}px`,
                "--grid-y": `${65 + Math.floor(i / 6) * 61}px`,
                "--end-x": `${310 + (i % 8) * 32}px`,
                "--end-y": `${170 - (i % 5) * 16}px`,
              }}
            >
              <rect className={styles.card} width="74" height="36" rx="5" />
              <rect
                className={styles.mark}
                x="10"
                y="10"
                width="5"
                height="16"
                rx="1"
              />
              <path d="M24 13H61M24 23H49" className={styles.lines} />
            </g>
          ))}
          <g className={styles.scan}>
            <rect
              x="-22"
              y="40"
              width="22"
              height="195"
              fill="currentColor"
              opacity=".09"
            />
            <path d="M0 40V235" stroke="currentColor" strokeWidth="2" />
          </g>
          <g className={styles.review}>
            <circle cx="871" cy="195" r="48" />
            <text x="871" y="269" textAnchor="middle">
              REVIEW
            </text>
          </g>
          <g className={styles.result} data-finish="true">
            <rect
              x="225"
              y="38"
              width="540"
              height="218"
              rx="10"
              className={styles.resultPanel}
            />
            <text x="250" y="73" className={styles.resultTitle}>
              USEFUL DATA. WORKING SYSTEMS.
            </text>
            {[45, 74, 57, 103, 88, 65, 113, 94].map((height, i) => (
              <rect
                key={i}
                className={styles.bar}
                x={251 + i * 30}
                y={222 - height}
                width="18"
                height={height}
                rx="3"
              />
            ))}
            <path d="M510 103V224" stroke="var(--line)" />
            <text x="535" y="135" className={styles.resultHeading}>
              Pipeline complete
            </text>
            <text x="535" y="170" className={styles.resultDetail}>
              17 records ready
            </text>
            <text x="535" y="204" className={styles.resultException}>
              1 exception caught
            </text>
            <g className={styles.mobileResult}>
              <text x="535" y="139">
                17 ready
              </text>
              <text x="535" y="191">
                1 to review
              </text>
            </g>
          </g>
        </svg>
        <div className={styles.captions} aria-hidden="true">
          {stages.map(([title, detail], i) => (
            <div
              key={title}
              className={`${styles.caption} ${styles[`stage${i}`]}`}
            >
              <strong>{title}</strong>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className={styles.note}>
        Illustrative pipeline: organise 18 synthetic records, flag one
        exception, and prepare 17 for use.
      </figcaption>
    </figure>
  );
}
