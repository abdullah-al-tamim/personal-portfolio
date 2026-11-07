"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { studies, experience } from "@/assets/studies";
import { projects, cvs } from "@/assets/portfolio";
import FlowExhibit from "@/components/FlowExhibit";
import WorkPreview from "@/components/WorkPreview";
import { ProjectArchive, Credentials } from "@/components/PortfolioArchive";
import FlowBackground from "@/components/FlowBackground";
import ContactForm from "@/components/ContactForm";
import PracticeCards from "@/components/PracticeCards";

const nav = [
  ["work", "Work"],
  ["research", "Research"],
  ["about", "Profile"],
  ["contact", "Contact"],
];

const workSummaries = {
  reconciliation: {
    label: "DATA AUTOMATION",
    title: "Find the gaps.",
    text: "Automated extraction and cross-source checks reveal missing records and possible duplicates.",
    outcome: "Selected for product integration",
  },
  architecture: {
    label: "DATA ENGINEERING",
    title: "Break the bottleneck.",
    text: "Parallel processing and reusable data replace heavy, repeated queries.",
    outcome: "96 deprecated logic instances updated",
  },
  intelligence: {
    label: "WORKFLOW DEVELOPMENT",
    title: "Connect the context.",
    text: "Team-built workflows match historical records to suggest missing information for submission errors.",
    outcome: "From an error to a proposed solution",
  },
};

function Study({ study }) {
  const summary = workSummaries[study.id];
  return (
    <article className="work-card" id={study.id}>
      <Link
        href={"/work/" + study.id}
        className="work-card-art"
        aria-label={`Read case study: ${summary.title}`}
      >
        <WorkPreview kind={study.id} />
      </Link>
      <div className="work-card-copy">
        <p className="micro">
          {study.number} / {summary.label}
        </p>
        <h3>{summary.title}</h3>
        <p>{summary.text}</p>
        <div className="work-card-outcome">{summary.outcome}</div>
        <Link className="text-link" href={"/work/" + study.id}>
          Read case study <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [playingDemo, setPlayingDemo] = useState(null);
  const [active, setActive] = useState("");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [copied, setCopied] = useState("Copy address");
  const menuButton = useRef(null);
  const root = useRef(null);
  const pause = paused || reduced;
  useEffect(() => {
    document.documentElement.dataset.motion = pause ? "paused" : "enabled";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [pause]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
    );
    nav.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (pause) return;
    const hero = root.current?.querySelector(".hero-title");
    const animation = hero?.animate(
      [
        { transform: "translateY(22px)", opacity: 0.3 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      { duration: 800, easing: "cubic-bezier(.16,1,.3,1)" },
    );
    return () => animation?.cancel();
  }, [pause]);
  const closeMenu = () => setMenu(false);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("alltamim.abdullah@gmail.com");
      setCopied("Address copied");
    } catch {
      setCopied("Use the email link");
    }
  }
  return (
    <div ref={root} className={`portfolio ${pause ? "motion-paused" : ""}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="wordmark"
          href="#home"
          aria-label="Abdullah Al Tamim — home"
        >
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <path
              d="M4 28 17 5h5L9 28M18 28l7-13 7 13M12 23h18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          </svg>
          <span>
            ABDULLAH
            <br />
            AL TAMIM
          </span>
        </a>
        <nav
          id="main-navigation"
          className={menu ? "nav is-open" : "nav"}
          aria-label="Main navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closeMenu();
              menuButton.current?.focus();
            }
          }}
        >
          {nav.map(([id, label], i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={closeMenu}
              aria-current={active === id ? "location" : undefined}
            >
              <sup>0{i + 1}</sup>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cv" href="#cv">
          CV <span aria-hidden="true">↓</span>
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="main-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Close" : "Menu"}{" "}
          <span aria-hidden="true">{menu ? "−" : "+"}</span>
        </button>
      </header>

      <main id="main">
        <section className="hero section-wrap" id="home">
          <FlowBackground paused={pause} />
          <div className="hero-kicker">
            <p className="micro">
              <span className="status-dot" />
              DATA ENGINEERING / AUTOMATION / APPLIED AI
            </p>
            <span className="micro">DHAKA, BANGLADESH · PORTFOLIO / 2026</span>
          </div>
          <a className="hero-identity" href="#about">
            <Image
              src="/images/abdullah-al-tamim.png"
              width={104}
              height={120}
              sizes="104px"
              loading="eager"
              alt="Abdullah Al Tamim"
            />
            <span>
              <strong>Abdullah Al Tamim</strong>
              <span>Senior Data Automations Analyst</span>
              <small>Augmedix / Commure | Athelas</small>
            </span>
            <span className="identity-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <h1 className="hero-title">
            Order from
            <br />
            <span className="hero-indent">
              complexity<span className="accent">.</span>
            </span>
          </h1>
          <div className="hero-context">
            <span className="hero-index micro">
              ENGINEERING
              <br />
              THAT MOVES WORK FORWARD
            </span>
            <p>I build systems that make data useful.</p>
            <a
              className="circle-link"
              href="#work"
              aria-label="Explore selected work"
            >
              <span aria-hidden="true">↙</span>
            </a>
          </div>
          <FlowExhibit paused={pause} />
        </section>
        <section
          className="impact section-wrap"
          aria-label="2025 professional impact"
        >
          <p className="micro">
            A YEAR IN PRACTICE
            <br />
            <span>2025 / REPORTED IMPACT</span>
          </p>
          <div>
            <strong>
              20<span>+</span>
            </strong>
            <p>Workflows built</p>
          </div>
          <div>
            <strong>
              ~70<span>h</span>
            </strong>
            <p>Estimated team time saved / week</p>
          </div>
          <div>
            <strong>
              $10<span>M+</span>
            </strong>
            <p>Tracked claims value supported</p>
          </div>
          <p className="impact-note">
            Time saving is an estimate. Claims value is operational scope, not
            revenue recovered.
          </p>
        </section>
        <section className="selected-work section-wrap" id="work">
          <div className="section-heading">
            <p className="micro">01 / SELECTED SYSTEMS</p>
            <h2>
              Less friction.
              <br />
              <span className="muted">More forward.</span>
            </h2>
            <p className="section-aside">
              Practical systems for messy data and repetitive work.
            </p>
          </div>
          <div className="work-card-grid">
            {studies.map((s) => (
              <Study key={s.id} study={s} />
            ))}
          </div>
          <p className="work-disclosure">
            Professional work, explained with synthetic examples. Full context
            and individual contributions in each case study.
          </p>
        </section>
        <section className="research section-wrap" id="research">
          <div className="research-lead">
            <p className="micro">02 / RESEARCH & EXPERIMENTS</p>
            <h2>
              From records
              <br />
              to <em>possibilities.</em>
            </h2>
            <p>Exploring how machines learn from images and signals.</p>
          </div>
          <div className="research-papers">
            {projects
              .filter((p) => p.category === "Research")
              .map((p, i) => (
                <article className="paper" key={p.id}>
                  <div className="paper-figure" aria-hidden="true">
                    {i === 0 ? (
                      <svg viewBox="0 0 400 150">
                        {Array.from({ length: 9 }, (_, n) => (
                          <g key={n} transform={`translate(${30 + n * 41},75)`}>
                            <ellipse
                              rx={12 + (n % 3) * 3}
                              ry={24 + (n % 4) * 4}
                              fill="none"
                              stroke="currentColor"
                              transform={`rotate(${n * 28})`}
                            />
                            <circle r="3" fill="var(--accent)" />
                          </g>
                        ))}
                      </svg>
                    ) : (
                      <svg viewBox="0 0 400 150">
                        <path
                          d="M0 75h30l8-15 8 30 8-15h35l8-45 8 90 8-45h45l8-20 8 40 8-20h40l8-55 8 110 8-55h40l8-25 8 50 8-25h60"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="micro">{p.period}</p>
                  <h3>
                    {i === 0
                      ? "Learning from microscopic images."
                      : "Learning from brain signals."}
                  </h3>
                  <details className="research-details">
                    <summary>Research details & my contribution</summary>
                    <p>
                      <strong>
                        {p.id === "eeg"
                          ? "Decoding Object Shapes from EEG Signals of the Brain"
                          : "Unveiling Microorganism Diversity through Neural Network-driven Classification"}
                      </strong>
                    </p>
                    <p>{p.details}</p>
                  </details>
                  <a
                    className="text-link"
                    href={p.id === "eeg" ? "#eeg-demo" : p.href}
                    target={p.id === "eeg" ? undefined : "_blank"}
                    rel={p.id === "eeg" ? undefined : "noreferrer"}
                    onClick={
                      p.id === "eeg" ? () => setPlayingDemo("eeg") : undefined
                    }
                  >
                    {p.id === "eeg" ? "Watch the EEG demo" : p.link}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
          </div>
        </section>
        <ProjectArchive
          motionPaused={paused}
          playingDemo={playingDemo}
          onPlaybackChange={setPlayingDemo}
        />
        <section className="profile section-wrap" id="about">
          <div className="profile-photo">
            <Image
              src="/images/abdullah-al-tamim.png"
              alt="Abdullah Al Tamim in a navy suit"
              width={987}
              height={1164}
              sizes="(max-width: 760px) 90vw, 40vw"
            />
            <span className="micro">ABDULLAH AL TAMIM / DHAKA, BD</span>
          </div>
          <div className="profile-copy">
            <p className="micro">03 / THE PERSON & THE PRACTICE</p>
            <h2>
              Understand the work.
              <br />
              <em>Then build the system.</em>
            </h2>
            <p className="profile-intro">
              I’m a Dhaka-based Senior Data Automations Analyst at Augmedix /
              Commure | Athelas.
            </p>
            <p>
              CSE graduate from East West University, preparing for master’s
              study. My work connects data engineering, software development,
              and applied AI research.
            </p>
            <a
              className="text-link"
              href="https://linkedin.com/in/tamim--abdullah"
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
        <section
          className="experience section-wrap"
          aria-labelledby="experience-title"
        >
          <div className="section-heading">
            <p className="micro">EXPERIENCE & EDUCATION</p>
            <h2 id="experience-title">
              A continuous
              <br />
              <span className="muted">line of inquiry.</span>
            </h2>
          </div>
          <div className="timeline">
            {experience.map((item) => (
              <article key={item.period}>
                <p className="micro">{item.period}</p>
                <div>
                  <h3>{item.organization}</h3>
                  <p className="role">{item.role}</p>
                  <p>{item.detail}</p>
                </div>
                <span className="timeline-type">{item.kind}</span>
              </article>
            ))}
          </div>
          <aside
            className="contribution-note"
            aria-label="Repository contribution milestone"
          >
            <span className="contribution-rank">
              03<span>/ 163</span>
            </span>
            <div>
              <p className="micro">CONTRIBUTING TO THE SHARED SYSTEM</p>
              <h3>Third-ranked contributor.</h3>
              <p>
                Ranked third among 163 contributors to an internal Commure
                Retool workflow repository.
              </p>
              <small>
                GitHub contributor snapshot supplied October 2026.
                Repository-specific ranking; private source.
              </small>
            </div>
          </aside>
        </section>
        <section
          className="expertise section-wrap"
          aria-labelledby="expertise-title"
        >
          <p className="micro">TOOLS IN SERVICE OF THE PROBLEM</p>
          <h2 id="expertise-title">A connected practice.</h2>
          <PracticeCards paused={pause} />
        </section>
        <Credentials />
        <section className="cv section-wrap" id="cv">
          <div>
            <p className="micro">TAKE THE DETAILS WITH YOU</p>
            <h2>
              One person.
              <br />
              Three perspectives.
            </h2>
            <p>Choose the CV that fits your context.</p>
          </div>
          <div className="cv-links">
            {cvs.map((cv, i) => (
              <a href={`/cv/${cv.file}`} download key={cv.file}>
                <span className="micro">0{i + 1} / PDF</span>
                <span>
                  <strong>{cv.title}</strong>
                  <small>{cv.detail}</small>
                </span>
                <span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
        </section>
        <section className="contact section-wrap" id="contact">
          <div className="contact-top">
            <p className="micro">04 / NEXT CONVERSATION</p>
            <span className="micro">AUTOMATION · RESEARCH · COLLABORATION</span>
          </div>
          <h2>
            What needs
            <br />
            <a href="mailto:alltamim.abdullah@gmail.com">
              to work better?<span aria-hidden="true">↗</span>
            </a>
          </h2>
          <ContactForm />
          <div className="contact-bottom">
            <div>
              <a className="email" href="mailto:alltamim.abdullah@gmail.com">
                alltamim.abdullah@gmail.com
              </a>
              <button className="copy-button" onClick={copyEmail}>
                {copied}
              </button>
              <span className="sr-only" role="status">
                {copied === "Address copied"
                  ? "Email address copied to clipboard"
                  : ""}
              </span>
            </div>
            <div className="social-links">
              <a
                href="https://linkedin.com/in/tamim--abdullah"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://github.com/abdullah-al-tamim"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer section-wrap">
        <a href="#home">Abdullah Al Tamim © 2026</a>
        <button
          aria-pressed={pause}
          disabled={reduced}
          onClick={() => setPaused(!paused)}
        >
          {reduced
            ? "Reduced motion active"
            : paused
              ? "Resume motion"
              : "Pause motion"}
        </button>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}
