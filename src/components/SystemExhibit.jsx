"use client";
import { useState } from "react";

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

function Reconciliation({ step }) {
  return (
    <div className="encounter-audit">
      <div className="audit-existing">
        <strong>EHR</strong><span>Existing import →<small>Duplicate-prevention rules apply</small></span><strong>Database</strong>
      </div>
      <p className="audit-context">Already in place · information may lag or encounters may be blocked</p>
      <div className={`audit-comparison ${step > 0 ? "is-compared" : ""}`}>
        <div><span>EHR encounter report</span><strong>{step > 0 ? "120" : "—"}</strong><small>Automated report extraction</small></div>
        <span className="audit-versus" aria-hidden="true">↔</span>
        <div><span>Database encounters</span><strong>{step > 0 ? "116" : "—"}</strong><small>Corresponding database count</small></div>
      </div>
      <div className={`audit-finding ${step === 2 ? "is-reviewed" : ""}`}>
        <strong>{step === 0 ? "Audit layer" : "Difference: 4 encounters"}</strong>
        <span>{step === 0 ? "Check the report against the database" : step === 1 ? "A discrepancy to investigate" : "Review freshness & import-rule exclusions"}</span>
        {step === 2 && <small>No automatic re-import · duplicate safeguards stay in place</small>}
      </div>
      <p className="micro audit-example">FICTIONAL COUNTS / EXPLANATORY MODEL</p>
    </div>
  );
}

function Routing({ step }) {
  return (
    <svg
      viewBox="0 0 700 300"
      role="img"
      aria-label={
        [
          "Three fictional categories of unresolved records",
          "Each category connects to its own guidance",
          "Guidance routes each category into an action queue",
        ][step]
      }
    >
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path
            d={`M185 ${60 + i * 85}H310Q330 ${60 + i * 85} 350 ${60 + i * 85}H570`}
            fill="none"
            stroke="currentColor"
            opacity=".2"
          />
          <rect
            x="65"
            y={38 + i * 85}
            width="120"
            height="44"
            fill="var(--diagram-bg)"
            stroke="currentColor"
            strokeOpacity=".4"
          />
          <text x="82" y={65 + i * 85} fill="currentColor" fontSize="12">
            CATEGORY {["A", "B", "C"][i]}
          </text>
          <g className="routing-guidance" opacity={step > 0 ? 1 : 0.15}>
            <circle
              cx="350"
              cy={60 + i * 85}
              r="18"
              fill="var(--diagram-bg)"
              stroke="var(--accent)"
            />
            <text
              x="350"
              y={64 + i * 85}
              textAnchor="middle"
              fill="var(--accent)"
              fontSize="11"
            >
              {i + 1}
            </text>
          </g>
          <g className="routing-action" opacity={step === 2 ? 1 : 0.12}>
            <rect
              x="530"
              y={40 + i * 85}
              width="88"
              height="40"
              fill="var(--ink)"
            />
            <path
              d={`m546 ${59 + i * 85} 5 5 9-10`}
              fill="none"
              stroke="var(--paper)"
            />
            <text x="566" y={64 + i * 85} fill="var(--paper)" fontSize="10">
              ROUTE
            </text>
          </g>
        </g>
      ))}
      <text x="65" y="292" className="svg-label">
        CONTEXT
      </text>
      <text x="310" y="292" className="svg-label">
        GUIDANCE
      </text>
      <text x="530" y="292" className="svg-label">
        NEXT ACTION
      </text>
    </svg>
  );
}

export default function StudyDiagram({ study }) {
  const [step, setStep] = useState(0);
  return (
    <div className="study-diagram">
      <div className="diagram-heading">
        <span className="micro">FIG. {study.number} / SYSTEM ANATOMY</span>
        <span className="micro">ILLUSTRATIVE MODEL</span>
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
            onClick={() => setStep(i)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {s.name}
          </button>
        ))}
      </div>
      {study.id === "architecture" ? (
        <Architecture step={step} />
      ) : study.id === "intelligence" ? (
        <Routing step={step} />
      ) : (
        <Reconciliation step={step} />
      )}
      <div
        className={`mobile-diagram ${study.id} stage-${step}`}
        hidden={study.id === "reconciliation"}
        aria-label="Simplified system view"
      >
        {study.id === "architecture" ? (
          <>
            <span className="mobile-diagram-label">REQUEST</span>
            <div className={`mobile-chunks ${step > 0 ? "parallel" : ""}`}>
              {[1, 2, 3, 4].map((i) => (
                <span key={i}>Chunk 0{i}</span>
              ))}
            </div>
            <span
              className={`mobile-output ${step === 2 ? "cache-active" : ""}`}
            >
              {step === 2
                ? "Local cache → reusable view"
                : step === 1
                  ? "Combine results → view"
                  : "Dependent sequence → view"}
            </span>
          </>
        ) : study.id === "intelligence" ? (
          <>
            {["A", "B", "C"].map((s, i) => (
              <div className="mobile-routing" key={s}>
                <span>Category {s}</span>
                <span className={step > 0 ? "lit" : ""}>
                  {step > 0 ? `Guide ${i + 1}` : "Unassigned"}
                </span>
                <span className={step === 2 ? "lit" : ""}>
                  {step === 2 ? "Route ↗" : "Review"}
                </span>
              </div>
            ))}
            <span className="mobile-diagram-label">
              FICTIONAL CATEGORIES / NO CLAIM DATA
            </span>
          </>
        ) : (
          <>
            <div className="mobile-records">
              <span>Source A</span>
              <span>Source B</span>
              <span>Source C</span>
            </div>
            <div className="mobile-gate">
              {step === 0 ? "Compare records ↓" : "Validate candidates ↓"}
            </div>
            <div className="mobile-branches">
              <span>
                {step === 2 ? "Eligible → route" : "Eligible records"}
              </span>
              <span>Exceptions → review</span>
            </div>
          </>
        )}
      </div>
      <div className="diagram-caption" aria-live="polite">
        <h4>{study.steps[step].title}</h4>
        <p>{study.steps[step].text}</p>
      </div>
    </div>
  );
}
