"use client";
import { useEffect, useRef, useState } from "react";

const coordinates = Array.from({ length: 36 }, (_, i) => ({
  x: 35 + ((i * 73) % 430),
  y: 30 + ((i * 47) % 215),
  orderedX: 570 + (i % 9) * 39,
  orderedY: 55 + Math.floor(i / 9) * 53,
}));

export function SystemExhibit() {
  const [ordered, setOrdered] = useState(true);
  return (
    <div className={`system-exhibit ${ordered ? "is-ordered" : ""}`}>
      <div className="exhibit-top">
        <span className="micro">FIG. 01 / FROM FRAGMENT TO FLOW</span>
        <button
          className="switch"
          onClick={() => setOrdered(!ordered)}
          aria-pressed={ordered}
        >
          <span className="switch-light" />
          {ordered ? "System on" : "Raw inputs"}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <svg
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        role="img"
        aria-label={
          ordered
            ? "Scattered records converge into organized parallel rows. One exception remains separate for review."
            : "Unstructured records are scattered across the input field."
        }
      >
        <defs>
          <pattern
            id="fine-lines"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 0V7" stroke="currentColor" strokeOpacity=".08" />
          </pattern>
        </defs>
        <rect
          x="510"
          y="12"
          width="455"
          height="256"
          rx="128"
          fill="url(#fine-lines)"
        />
        {[0, 1, 2, 3].map((i) => (
          <path
            className="system-thread"
            key={i}
            d={`M50 ${45 + i * 60} C310 ${-20 + i * 90}, 390 ${55 + i * 53}, 570 ${55 + i * 53} H925`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity={ordered ? ".2" : ".06"}
          />
        ))}
        <path
          d="M492 20V270"
          className="threshold"
          stroke="currentColor"
          strokeDasharray="2 8"
          opacity=".25"
        />
        {coordinates.map((p, i) => (
          <g
            className="data-record"
            key={i}
            style={{
              transform: `translate(${ordered ? p.orderedX : p.x}px, ${ordered ? p.orderedY : p.y}px) rotate(${ordered ? 0 : ((i % 5) - 2) * 14}deg)`,
              transitionDelay: `${i * 9}ms`,
            }}
          >
            <rect
              width={i % 4 === 0 ? 24 : 17}
              height="5"
              fill={i % 7 === 0 ? "var(--accent)" : "currentColor"}
            />
            <rect
              y="9"
              width="13"
              height="2"
              fill="currentColor"
              opacity=".25"
            />
          </g>
        ))}
        <g className="raw-traces" opacity={ordered ? ".16" : ".65"}>
          {coordinates.slice(0, 20).map((p, i) => (
            <path
              key={i}
              d={`M${p.x} ${p.y}h${12 + (i % 3) * 8}`}
              stroke="currentColor"
            />
          ))}
        </g>
        <g
          className="exception-record"
          style={{
            transform: `translate(${ordered ? 470 : 300}px, ${ordered ? 265 : 120}px)`,
          }}
        >
          <circle r="5" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <text x="14" y="4" fill="var(--accent)" fontSize="11">
            {ordered ? "REVIEW, NOT IGNORE" : "UNRESOLVED"}
          </text>
        </g>
        <text x="40" y="292" className="svg-label">
          INPUTS / FRAGMENTED
        </text>
        <text x="710" y="292" className="svg-label">
          OUTPUT / STRUCTURED
        </text>
      </svg>
      <div className="exhibit-bottom">
        <p>
          {ordered
            ? "Structure the routine. Keep the exceptions visible."
            : "Different sources. Missing context. Repeated manual work."}
        </p>
        <span className="micro">INTERACTIVE CONCEPT / SYNTHETIC RECORDS</span>
      </div>
    </div>
  );
}

function Architecture({ step }) {
  return (
    <svg
      viewBox="0 0 700 300"
      role="img"
      aria-label={
        step === 0
          ? "Sequential processing: four dependent chunks."
          : step === 1
            ? "Four independent chunks execute in parallel and converge."
            : "Parallel chunks feed a localized cache and a reusable view."
      }
    >
      <g
        className="diagram-lines"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        opacity=".35"
      >
        {step === 0 ? (
          <path d="M80 150H620" />
        ) : (
          [0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M80 150C190 150,190 ${55 + i * 60},280 ${55 + i * 60}H390C470 ${55 + i * 60},470 150,530 150H620`}
            />
          ))
        )}
      </g>
      <circle cx="80" cy="150" r="8" fill="var(--accent)" />
      {[0, 1, 2, 3].map((i) => (
        <g
          key={i}
          className="chunk"
          style={{
            transform: `translate(${step === 0 ? 170 + i * 105 : 280}px, ${step === 0 ? 124 : 30 + i * 60}px)`,
          }}
        >
          <rect
            width="72"
            height="48"
            fill="var(--diagram-bg)"
            stroke="currentColor"
            strokeOpacity=".5"
          />
          <text
            x="36"
            y="29"
            textAnchor="middle"
            fill="currentColor"
            fontSize="12"
          >
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
      <g className="cache" opacity={step === 2 ? 1 : 0}>
        <rect x="496" y="117" width="70" height="66" fill="var(--accent)" />
        <text x="531" y="146" textAnchor="middle" fill="white" fontSize="10">
          LOCAL
        </text>
        <text x="531" y="161" textAnchor="middle" fill="white" fontSize="10">
          CACHE
        </text>
      </g>
      <circle
        cx="620"
        cy="150"
        r="16"
        fill="var(--diagram-bg)"
        stroke="currentColor"
      />
      <path d="m613 150 5 5 10-11" stroke="currentColor" fill="none" />
      <text x="55" y="285" className="svg-label">
        REQUEST
      </text>
      <text x="280" y="285" className="svg-label">
        {step === 0 ? "SERIAL DEPENDENCIES" : "INDEPENDENT CHUNKS"}
      </text>
      <text x="590" y="285" className="svg-label">
        VIEW
      </text>
    </svg>
  );
}

function ProcessDiagram({ step, resolver }) {
  const [excess, setExcess] = useState(false);
  const nodes = resolver
    ? [
        {
          tech: "RETOOL / ERROR CHECK",
          title: "Import blocked",
          label: "Required member ID",
          value: "Missing",
          detail: "Identify the missing field",
        },
        {
          tech: "SQL / HISTORY LOOKUP",
          title: "Earlier encounter",
          label: "Same patient / member ID",
          value: step > 0 ? "DEMO-104" : "Look up history",
          detail: "Recover the relevant context",
        },
        {
          tech: "RETOOL / RESOLUTION",
          title: "Proposed solution",
          label: "Suggested member ID",
          value: step === 2 ? "DEMO-104" : "Awaiting context",
          detail: "Surface a suggestion for review",
        },
      ]
    : [
        {
          tech: "PYTHON + PLAYWRIGHT / SELENIUM",
          title: "Extract EHR report",
          label: "Reported encounters",
          value: "120",
          detail: "Browser automation downloads the report",
        },
        {
          tech: "SQL / DATABASE COMPARISON",
          title: "Compare the counts",
          label: "Database encounters",
          value: step > 0 ? (excess ? "124" : "116") : "Read database",
          detail: "Compare with the report count",
        },
        {
          tech: "RETOOL / AUDIT WORKFLOW",
          title: "Investigate the gap",
          label: "Difference to investigate",
          value:
            step === 2
              ? excess
                ? "4 extra"
                : "4 missing"
              : "Awaiting comparison",
          detail: excess
            ? "Investigate possible duplicate encounters"
            : "Check freshness, rules and import errors",
        },
      ];
  return (
    <div className="process-exhibit">
      <p className="process-context">
        {resolver
          ? "EHR encounter → existing import → missing-information error"
          : "Existing EHR imports keep running. This is the separate audit layer."}
      </p>
      {!resolver && (
        <div
          className="audit-scenarios"
          role="group"
          aria-label="Audit example"
        >
          <button aria-pressed={!excess} onClick={() => setExcess(false)}>
            DB has fewer
          </button>
          <button aria-pressed={excess} onClick={() => setExcess(true)}>
            DB has more
          </button>
        </div>
      )}
      <div className="process-nodes">
        {nodes.map((node, i) => (
          <div
            key={node.title}
            className={`process-node ${step >= i ? "is-reached" : ""} ${step === i ? "is-current" : ""}`}
          >
            <span className="process-tech">{node.tech}</span>
            <h4>{node.title}</h4>
            <div className="process-record">
              <span>{node.label}</span>
              <strong key={node.value}>{node.value}</strong>
            </div>
            <p>{node.detail}</p>
            {i < 2 && (
              <span className="process-connector" aria-hidden="true">
                <i />
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="micro">FICTIONAL EXAMPLE / NO PATIENT OR PRODUCTION DATA</p>
      {!resolver && (
        <a className="process-related" href="#intelligence">
          Missing information blocked the import? See the team’s resolver
          workflow below ↗
        </a>
      )}
    </div>
  );
}

export default function StudyDiagram({ study, paused }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const host = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let visible = false;
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };
    const update = () => {
      stop();
      if (visible && playing && !paused && !reduced.matches && !document.hidden)
        timer = setInterval(() => setStep((s) => (s + 1) % 3), 4500);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.35 },
    );
    observer.observe(host.current);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
    };
  }, [playing, paused]);
  return (
    <div
      className={`study-diagram ${playing && !paused ? "is-playing" : ""}`}
      ref={host}
    >
      <div className="diagram-heading">
        <span className="micro">FIG. {study.number} / HOW IT WORKS</span>
        <button
          className="diagram-play"
          disabled={paused}
          onClick={() => setPlaying((p) => !p)}
        >
          {paused
            ? "Motion paused"
            : playing
              ? "Pause walkthrough"
              : "Play walkthrough"}
        </button>
      </div>
      <div
        className="diagram-controls"
        role="group"
        aria-label={`${study.name} diagram stages`}
      >
        {study.steps.map((s, i) => (
          <button
            key={s.name}
            aria-pressed={step === i}
            onClick={() => {
              setPlaying(false);
              setStep(i);
            }}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {s.name}
          </button>
        ))}
      </div>
      {study.id === "architecture" ? (
        <>
          <Architecture step={step} />
          <p className="architecture-tools">
            SQL / StarRocks: query data → JavaScript: coordinate parallel chunks
            → Retool DB: cache results → Retool app: display the view
          </p>
          <div className="mobile-diagram architecture">
            <span className="mobile-diagram-label">
              SQL / STARROCKS → JAVASCRIPT PROCESSING
            </span>
            <div className={`mobile-chunks ${step > 0 ? "parallel" : ""}`}>
              {[1, 2, 3, 4].map((i) => (
                <span key={i}>Chunk 0{i}</span>
              ))}
            </div>
            <span className="mobile-output">
              {step === 2
                ? "Retool DB cache → Retool app"
                : step === 1
                  ? "Combine parallel results → Retool app"
                  : "Run chunks in sequence → Retool app"}
            </span>
          </div>
        </>
      ) : (
        <ProcessDiagram step={step} resolver={study.id === "intelligence"} />
      )}
      <div className="diagram-caption" aria-live={playing ? "off" : "polite"}>
        <h4>{study.steps[step].title}</h4>
        <p>{study.steps[step].text}</p>
      </div>
    </div>
  );
}
