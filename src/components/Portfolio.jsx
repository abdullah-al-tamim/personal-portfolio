"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects, capabilities, cvs } from "@/assets/portfolio";

function Arrow({ diagonal = false }) {
  return (
    <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ProjectVisual({ type }) {
  return (
    <div className={`project-visual ${type}`} aria-hidden="true">
      <div className="visual-top">
        <span>AT / SYSTEM STUDIES</span>
        <span>◇</span>
      </div>
      {type === "pipeline" && (
        <div className="pipeline-art">
          <div className="source-stack">
            <i />
            <i />
            <i />
          </div>
          <span className="flow-line" />
          <div className="process-node">
            <span>↳</span>
          </div>
          <span className="flow-line" />
          <div className="result-stack">
            <i>✓</i>
            <i>✓</i>
            <i>✓</i>
          </div>
        </div>
      )}
      {type === "query" && (
        <div className="query-art">
          <div className="query-columns">
            {[35, 68, 47, 88, 62, 100, 78, 115, 93].map((h, i) => (
              <i
                key={i}
                style={{ "--bar": `${h}px`, "--delay": `${i * 60}ms` }}
              />
            ))}
          </div>
          <div className="query-caption">
            <span>EXTRACT</span>
            <span>PROCESS</span>
            <span>UNDERSTAND ↗</span>
          </div>
        </div>
      )}
      {type === "neural" && (
        <svg className="neural-art" viewBox="0 0 440 200">
          <g stroke="currentColor" opacity=".3">
            {[45, 100, 155].flatMap((y, i) =>
              [30, 76, 124, 170].map((y2, j) => (
                <path
                  key={`${i}-${j}`}
                  d={`M100 ${y}L220 ${y2}L340 ${45 + (j % 3) * 55}`}
                />
              )),
            )}
          </g>
          {[45, 100, 155].map((y) => (
            <circle key={`a${y}`} cx="100" cy={y} r="13" />
          ))}
          {[30, 76, 124, 170].map((y) => (
            <circle key={`b${y}`} cx="220" cy={y} r="10" />
          ))}
          {[45, 100, 155].map((y) => (
            <circle key={`c${y}`} cx="340" cy={y} r="13" />
          ))}
        </svg>
      )}
      {type === "signal" && (
        <svg className="signal-art" viewBox="0 0 440 200">
          <path
            className="wave-back"
            d="M0 105 Q25 50 50 105T100 105T150 105T200 105T250 105T300 105T350 105T400 105T450 105"
          />
          <path d="M0 100H42L50 82 58 119 66 93 76 100H110L119 67 129 141 140 40 151 161 162 78 175 100H210L220 85 230 119 240 95 250 100H282L293 60 305 140 317 32 329 165 341 81 352 100H440" />
        </svg>
      )}
      <div className="visual-bottom">
        <span>
          {
            {
              pipeline: "INPUT → AUTOMATION → OUTCOME",
              query: "STRUCTURE BEFORE SCALE",
              neural: "PATTERNS INTO KNOWLEDGE",
              signal: "SIGNAL → FEATURES → LEARNING",
            }[type]
          }
        </span>
        <span>ILLUSTRATION</span>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All work");
  const [active, setActive] = useState("home");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const root = useRef(null);
  const copyTimer = useRef(null);
  const revealed = useRef(new WeakSet());
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const container = root.current;
    // Only finish finite entrance animations; CSS handles continuous decorative motion.
    const finishEntrances = () =>
      container
        .querySelectorAll("[data-reveal]")
        .forEach((el) =>
          el.getAnimations().forEach((animation) => animation.finish()),
        );
    if (motionPaused || reduced.matches) finishEntrances();
    const onMotionPreference = () => {
      if (reduced.matches) finishEntrances();
    };
    reduced.addEventListener("change", onMotionPreference);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (
              !reduced.matches &&
              !motionPaused &&
              !revealed.current.has(entry.target)
            )
              entry.target.animate(
                [
                  { opacity: 0.2, transform: "translateY(22px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" },
              );
            revealed.current.add(entry.target);
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    root.current
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    const navigation = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-15% 0px -65% 0px" },
    );
    root.current
      .querySelectorAll("section[id]")
      .forEach((el) => navigation.observe(el));
    return () => {
      observer.disconnect();
      navigation.disconnect();
      reduced.removeEventListener("change", onMotionPreference);
    };
  }, [filter, motionPaused]);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  useEffect(() => {
    const dismiss = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    if (menuOpen) document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [menuOpen]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("alltamim.abdullah@gmail.com");
      setCopied(true);
      setCopyFailed(false);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopyFailed(true);
    }
  }
  return (
    <div
      ref={root}
      className={motionPaused ? "portfolio motion-paused" : "portfolio"}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="wordmark"
          href="#home"
          aria-label="Abdullah Al Tamim — home"
        >
          at<span>.</span>
        </a>
        <nav
          id="site-navigation"
          className={menuOpen ? "navigation is-open" : "navigation"}
          aria-label="Main navigation"
        >
          {[
            ["work", "Selected work"],
            ["about", "About"],
            ["research", "Research"],
            ["contact", "Contact"],
          ].map(([id, label]) => (
            <a
              href={`#${id}`}
              key={id}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="mailto:alltamim.abdullah@gmail.com">
          Let’s talk <Arrow diagonal />
        </a>
        <button
          id="menu-toggle"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}{" "}
          <span aria-hidden="true">{menuOpen ? "−" : "+"}</span>
        </button>
      </header>
      <main id="main">
        <section id="home" className="hero section-wrap">
          <div className="hero-kicker">
            <span className="status-dot" />
            DATA AUTOMATION · ANALYTICS · APPLIED AI
            <span className="hero-location">DHAKA, BANGLADESH ↗</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="intro">Hello, I’m Abdullah Al Tamim.</p>
              <h1>
                From complex
                <br />
                data. To{" "}
                <span>
                  clear
                  <br className="desktop-break" /> decisions.
                </span>
              </h1>
              <p className="hero-description">
                I build automations that give people time back—and data tools
                that help them move forward with confidence.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#work">
                  Explore my work <Arrow diagonal />
                </a>
                <a className="text-link" href="#cv">
                  Download CV <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="current-role">
                <span className="role-line" />
                <p>
                  Senior Data Automation Analyst
                  <br />
                  <span>Augmedix Bangladesh · Commure</span>
                </p>
              </div>
            </div>
            <div className="portrait-wrap">
              <div className="portrait-label">
                <span>THE PERSON BEHIND THE PROCESS</span>
                <span>01 / AT</span>
              </div>
              <div className="portrait-frame">
                <Image
                  src="/images/abdullah-al-tamim.png"
                  alt="Abdullah Al Tamim wearing a navy suit"
                  fill
                  priority
                  sizes="(max-width: 600px) 90vw, (max-width: 1000px) 42vw, 470px"
                />
                <span className="portrait-cross" aria-hidden="true">
                  +
                </span>
              </div>
              <div className="portrait-caption">
                <span>
                  Engineer’s curiosity.
                  <br />
                  Analyst’s attention to detail.
                </span>
                <span className="asterisk" aria-hidden="true">
                  <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                    <g stroke="currentColor" strokeWidth="3">
                      <path d="M23 3v40M3 23h40M9 9l28 28M9 37 37 9" />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <span>TURNING EVERYDAY FRICTION INTO BETTER SYSTEMS</span>
            <a href="#impact">
              SCROLL TO DISCOVER <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section
          id="impact"
          className="impact section-wrap"
          aria-label="2025 impact"
        >
          <div className="impact-heading">
            <span className="eyebrow">A YEAR OF BUILDING</span>
            <p>Selected impact, 2025</p>
          </div>
          <div className="stat">
            <strong>
              20<span>+</span>
            </strong>
            <p>Workflows built</p>
          </div>
          <div className="stat">
            <strong>
              ~70<span>h</span>
            </strong>
            <p>Estimated team time saved / week</p>
          </div>
          <div className="stat">
            <strong>
              $10<span>M+</span>
            </strong>
            <p>Tracked claims value supported</p>
          </div>
        </section>
        <section id="work" className="work section-wrap section-space">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2>
                Built for a<br />
                <em>real-world difference.</em>
              </h2>
            </div>
            <p className="section-aside">
              From healthcare operations to machine learning research. A
              selection of problems I’ve worked on—and the thinking behind them.
            </p>
          </div>
          <div
            className="filters"
            role="group"
            aria-label="Filter selected work"
          >
            {["All work", "Automation", "Analytics", "Research"].map((item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
                {item === "All work" && <span>04</span>}
              </button>
            ))}
            <span className="filter-count" role="status">
              {filter === "All work"
                ? "04"
                : filter === "Research"
                  ? "02"
                  : "01"}{" "}
              PROJECTS
            </span>
          </div>
          <div className="project-grid">
            {projects
              .filter((p) => filter === "All work" || p.category === filter)
              .map((p) => (
                <article key={p.id} className="project-card" data-reveal>
                  <ProjectVisual type={p.visual} />
                  <div className="project-meta">
                    <span>{p.period}</span>
                    <span>/{p.number}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p className="project-description">{p.description}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <details className="project-details">
                    <summary>
                      Behind the work{" "}
                      <span className="details-plus" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <div>
                      <p className="outcome">{p.outcome}</p>
                      <p>{p.details}</p>
                      {p.href && (
                        <a
                          className="text-link"
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {p.link}
                          <Arrow diagonal />
                        </a>
                      )}
                    </div>
                  </details>
                </article>
              ))}
          </div>
          <p className="work-note">
            Professional work is described at a high level. Visuals are
            conceptual illustrations, not internal product screenshots.
          </p>
          <a
            className="text-link github-link"
            href="https://github.com/abdullah-al-tamim"
            target="_blank"
            rel="noreferrer"
          >
            More experiments on GitHub <Arrow diagonal />
          </a>
        </section>
        <section className="expertise dark-section" id="expertise">
          <div className="section-wrap section-space">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">02 / HOW I CONTRIBUTE</p>
                <h2>
                  Technical depth.
                  <br />
                  <em>Practical purpose.</em>
                </h2>
              </div>
              <p className="section-aside">
                The best system isn’t just technically sound. It makes someone’s
                day easier.
              </p>
            </div>
            <div className="capabilities">
              {capabilities.map((c) => (
                <article key={c.number} data-reveal>
                  <span className="capability-number">/{c.number}</span>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <div className="tool-list">{c.tools}</div>
                  <Arrow diagonal />
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="about" className="about section-wrap section-space">
          <div className="about-intro" data-reveal>
            <p className="eyebrow">03 / A LITTLE CONTEXT</p>
            <h2>
              Curious by nature.
              <br />
              <em>Methodical by practice.</em>
            </h2>
            <p>
              I’m Tamim, a data automation analyst based in Dhaka. My work sits
              where engineering meets operations: understanding a messy process,
              finding its bottlenecks, and building something dependable.
            </p>
            <p>
              At Augmedix Bangladesh (Commure), I work on healthcare data
              workflows, internal tools, and operational analytics. My computer
              science background and research experience keep me asking how
              these systems can be better.
            </p>
            <a
              className="text-link"
              href="https://linkedin.com/in/tamim--abdullah"
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn <Arrow diagonal />
            </a>
          </div>
          <div className="timeline" data-reveal>
            <article>
              <span className="timeline-date">FEB 2025 — PRESENT</span>
              <h3>
                Augmedix Bangladesh <span>· Commure</span>
              </h3>
              <p className="timeline-title">Senior Data Automation Analyst</p>
              <p>
                Promoted to Senior in March 2026. Building automation, improving
                data reliability, and supporting healthcare operations.
              </p>
            </article>
            <article>
              <span className="timeline-date">APR 2022 — MAY 2024</span>
              <h3>East West University</h3>
              <p className="timeline-title">
                Undergraduate & Graduate Teaching Assistant
              </p>
              <p>
                Supported six courses, including Algorithms, Database Systems,
                and Artificial Intelligence, through tutoring, project support,
                and assessment.
              </p>
            </article>
            <article>
              <span className="timeline-date">JAN 2020 — JUN 2024</span>
              <h3>BSc, Computer Science & Engineering</h3>
              <p className="timeline-title">East West University</p>
              <p>
                CGPA 3.88/4.00 · Magna Cum Laude
                <br />
                100% merit scholarship
              </p>
            </article>
          </div>
        </section>
        <section id="research" className="research section-wrap" data-reveal>
          <div className="research-marker" aria-hidden="true">
            ↗
          </div>
          <div>
            <p className="eyebrow">04 / RESEARCH & WHAT’S NEXT</p>
            <h2>
              Still asking
              <br />
              <em>better questions.</em>
            </h2>
            <p>
              From microorganism images to EEG signals, I’m interested in how
              machine learning can help us understand complex data. I’m
              preparing for master’s study and looking to deepen the connection
              between rigorous research and useful systems.
            </p>
            <a
              className="text-link"
              href="https://doi.org/10.1109/COMPAS60761.2024.10796528"
              target="_blank"
              rel="noreferrer"
            >
              Read my co-authored IEEE paper <Arrow diagonal />
            </a>
          </div>
          <div className="research-side">
            <span className="eyebrow">AREAS OF INTEREST</span>
            <p>
              Applied machine learning
              <br />
              Data engineering
              <br />
              Intelligent automation
            </p>
            <span className="research-small">
              A foundation in computer science.
              <br />
              An appetite for what’s next.
            </span>
          </div>
        </section>
        <section
          id="cv"
          className="cv-section section-wrap section-space"
          data-reveal
        >
          <div className="cv-heading">
            <p className="eyebrow">THE DETAILS, IN PDF</p>
            <h2>Take a closer look.</h2>
            <p>Choose the CV that fits your context.</p>
          </div>
          <div className="cv-grid">
            {cvs.map((cv) => (
              <a
                className="cv-card"
                key={cv.file}
                href={`/cv/${cv.file}`}
                download
              >
                <span className="eyebrow">PDF ↗</span>
                <h3>{cv.title}</h3>
                <p>{cv.detail}</p>
                <span className="cv-download">
                  Download CV <span aria-hidden="true">↓</span>
                </span>
              </a>
            ))}
          </div>
        </section>
        <section id="contact" className="contact dark-section">
          <div className="section-wrap section-space">
            <p className="eyebrow" data-reveal>
              05 / LET’S CONNECT
            </p>
            <div className="contact-heading" data-reveal>
              <h2>
                Good work starts
                <br />
                with a <em>conversation.</em>
              </h2>
              <a
                className="contact-circle"
                href="mailto:alltamim.abdullah@gmail.com"
                aria-label="Email Abdullah Al Tamim"
              >
                <Arrow diagonal />
              </a>
            </div>
            <div className="contact-bottom">
              <div>
                <p>
                  Have a data challenge, a research idea,
                  <br />
                  or an opportunity worth exploring?
                </p>
                <a
                  className="email-link"
                  href="mailto:alltamim.abdullah@gmail.com"
                >
                  alltamim.abdullah@gmail.com
                </a>
                <button className="copy-button" onClick={copyEmail}>
                  {copied ? "Copied ✓" : "Copy email"}
                </button>
                <span className="copy-status" role="status">
                  {copied
                    ? "Email address copied."
                    : copyFailed
                      ? "Select the email address to copy it, or use the email link."
                      : ""}
                </span>
              </div>
              <div className="social-links">
                <a
                  href="https://linkedin.com/in/tamim--abdullah"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <Arrow diagonal />
                </a>
                <a
                  href="https://github.com/abdullah-al-tamim"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <Arrow diagonal />
                </a>
              </div>
            </div>
            <footer>
              <a className="footer-name" href="#home">
                Abdullah Al Tamim<span>© {new Date().getFullYear()}</span>
              </a>
              <button
                className="motion-toggle"
                aria-pressed={motionPaused}
                onClick={() => setMotionPaused(!motionPaused)}
              >
                {motionPaused ? "Resume motion" : "Pause motion"}
              </button>
              <a href="#home">BACK TO TOP ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
