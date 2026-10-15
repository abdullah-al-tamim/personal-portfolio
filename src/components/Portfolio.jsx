"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { studies, experience, disciplines } from "@/assets/studies";
import { projects, cvs } from "@/assets/portfolio";
import StudyDiagram, { SystemExhibit } from "@/components/SystemExhibit";
import { ProjectArchive, Credentials } from "@/components/PortfolioArchive";
import FlowBackground from "@/components/FlowBackground";
import ContactForm from "@/components/ContactForm";

const nav = [
  ["work", "Work"],
  ["research", "Research"],
  ["about", "Profile"],
  ["contact", "Contact"],
];

function Study({ study }) {
  return (
    <article className="study" id={study.id}>
      <div className="study-title">
        <span className="study-number">{study.number}</span>
        <div>
          <p className="micro">{study.discipline}</p>
          <h3>{study.name}</h3>
        </div>
        <a
          className="study-permalink"
          href={`#${study.id}`}
          aria-label={`Link to ${study.name}`}
        >
          ↗
        </a>
      </div>
      <p className="study-intro">{study.intro}</p>
      <StudyDiagram study={study} />
      <div className="study-summary">
        <div>
          <span className="micro">THE PROBLEM</span>
          <p>{study.problem}</p>
        </div>
        <div>
          <span className="micro">MY CONTRIBUTION</span>
          <p>{study.contribution}</p>
        </div>
      </div>
      <details className="study-depth">
        <summary>
          <span>Read the engineering notes</span>
          <span className="expand-mark" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="depth-content">
          <div>
            <h4>What made it difficult</h4>
            <p>{study.difficulty}</p>
          </div>
          <div>
            <h4>Architecture & tradeoffs</h4>
            <p>{study.approach}</p>
          </div>
          <div>
            <h4>What changed</h4>
            <p>{study.outcome}</p>
          </div>
          <blockquote>{study.judgment}</blockquote>
        </div>
      </details>
      <div className="study-result">
        <strong>{study.metric}</strong>
        <span>{study.metricLabel}</span>
        <p className="micro">{study.tools}</p>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
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
              DATA AUTOMATION / OPERATIONAL INTELLIGENCE
            </p>
            <span className="micro">DHAKA, BANGLADESH · PORTFOLIO / 2026</span>
          </div>
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
            <p>
              I’m Abdullah Al Tamim. I build systems that reconcile fragmented
              data, automate repetitive work, and make the next decision
              clearer.
            </p>
            <a
              className="circle-link"
              href="#work"
              aria-label="Explore selected work"
            >
              <span aria-hidden="true">↙</span>
            </a>
          </div>
          <SystemExhibit />
          <div className="hero-foot">
            <p>
              Senior Data Automations Analyst
              <br />
              <span>Augmedix / Commure | Athelas</span>
            </p>
            <a href="#about" className="portrait-stamp">
              <Image
                src="/images/abdullah-al-tamim.png"
                width={64}
                height={72}
                alt="Abdullah Al Tamim"
              />
              <span>
                The person
                <br />
                behind the systems ↗
              </span>
            </a>
          </div>
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
              Three views into the work: reliable execution, scalable
              architecture, and decisions people can act on.
            </p>
          </div>
          <div className="work-layout">
            <aside className="work-index">
              <span className="micro">FIELD NOTES / 01—03</span>
              {studies.map((s) => (
                <a href={`#${s.id}`} key={s.id}>
                  <span>{s.number}</span>
                  {s.name}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
              <p>
                Employer systems are described at a high level. All diagrams use
                synthetic records and abstracted flows.
              </p>
            </aside>
            <div className="studies">
              {studies.map((s) => (
                <Study key={s.id} study={s} />
              ))}
            </div>
          </div>
        </section>
        <section className="research section-wrap" id="research">
          <div className="research-lead">
            <p className="micro">02 / RESEARCH & EXPERIMENTS</p>
            <h2>
              From records
              <br />
              to <em>possibilities.</em>
            </h2>
            <p>
              Alongside operational engineering, I’ve explored how machine
              learning interprets images and signals. I’m preparing for master’s
              study to deepen that connection.
            </p>
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
                      ? "Unveiling Microorganism Diversity through Neural Network-driven Classification"
                      : "Decoding Object Shapes from EEG Signals of the Brain"}
                  </h3>
                  <p>{p.details}</p>
                  <a
                    className="text-link"
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.link}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
          </div>
        </section>
        <ProjectArchive motionPaused={pause} />
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
              My work starts with the operation: what people repeat, where
              records diverge, and what happens when a process fails.
            </p>
            <p>
              I’m a Computer Science and Engineering graduate from East West
              University. Moving from operational analytics into automation
              taught me to treat exception handling, ownership, and clear
              information as part of the engineering—not as work left over after
              it.
            </p>
            <p>
              I also bring a researcher’s caution to applied AI: data quality
              and honest evaluation matter as much as the model.
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
          <div className="expertise-rows">
            {disciplines.map((item, i) => (
              <article key={item.title}>
                <span>0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
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
