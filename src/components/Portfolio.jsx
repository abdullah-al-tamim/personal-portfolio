"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { studies, experience } from "@/assets/studies";
import { projects, cvs } from "@/assets/portfolio";
import { ProjectArchive, Credentials } from "@/components/PortfolioArchive";
import WorkPreview from "@/components/WorkPreview";
import ContactForm from "@/components/ContactForm";
import s from "./Portfolio.module.css";
import FlowBackground from "@/components/FlowBackground";
import FlowExhibit from "@/components/FlowExhibit";
import PracticeCards from "@/components/PracticeCards";
import TubeVaultProject from "@/components/TubeVaultProject";
import { Icon, OrganizationMark } from "./PortfolioMarks";
const nav = [
  ["research", "Research"],
  ["work", "Projects"],
  ["about", "About"],
  ["contact", "Contact"],
];
const academicCV = "/cv/Abdullah_Al_Tamim_Academic_CV.pdf";
const titles = {
  reconciliation: "Finding the missing records",
  architecture: "Making complex workflows manageable",
  intelligence: "Giving errors useful context",
};
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function SectionTitle({ number, label, title, children }) {
  return (
    <div className={s.sectionHeading}>
      <p className={s.eyebrow}>
        {number} / {label}
      </p>
      <div>
        <h2>{title}</h2>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}
export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [copied, setCopied] = useState("");
  const menuButton = useRef(null);
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-nav-section]"));
    let frame = 0;
    function update() {
      frame = 0;
      const line = (menuButton.current?.closest("header")?.getBoundingClientRect().bottom ?? 80) + 32;
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top > line) break;
        current = section.dataset.navSection;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = "contact";
      setActiveSection(current);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  const pause = paused || reduced;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = pause ? "paused" : "enabled";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [pause]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("alltamim.abdullah@gmail.com");
      setCopied("Address copied");
    } catch {
      setCopied("Please use the email link");
    }
  }
  return (
    <div className={`${s.portfolio} ${pause ? "motion-paused" : ""}`}>
      <FlowBackground paused={pause} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={s.header}>
        <a
          href="#home"
          className={s.wordmark}
          aria-label="Abdullah Al Tamim: home"
        >
          Abdullah Al Tamim
        </a>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={`${s.nav} ${menu ? s.open : ""}`}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setMenu(false);
              menuButton.current?.focus();
            }
          }}
        >
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => setMenu(false)}>
                <Icon name={id === "work" ? "projects" : id} />
              {label}
            </a>
          ))}
        </nav>
        <a href={academicCV} className={s.cvButton}>
          Academic CV <span aria-hidden="true">↓</span>
        </a>
        <button
          ref={menuButton}
          className={s.menuButton}
          aria-expanded={menu}
          aria-controls="main-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Close −" : "Menu +"}
        </button>
      </header>
      <main id="main">
        <section id="home" className={s.hero}>
          <div className={s.heroCopy}>
            <p className={s.introduction}>Hello, I’m Tamim.</p>
            <h1>
              Making data useful.
              <br />
              <em>Making life easier.</em>
            </h1>
            <p className={s.heroDescription}>
              I love building systems that solve real problems and that people
              enjoy using.
            </p>
            <div className={s.actions}>
              <a className={s.primaryButton} href="#research">
                Explore my research <Arrow />
              </a>
              <a className={s.inlineLink} href="#work">
                See what I build <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className={s.current}>
              <Icon name="work" /> Senior Data Automations Analyst at Commure
              BD.
              <br />
              <Icon name="study" /> Preparing for master’s study in data and AI.
            </p>
          </div>
          <figure className={s.portrait}>
            <div className={s.portraitImage}>
              <Image
                src="/images/abdullah-al-tamim.png"
                alt="Abdullah Al Tamim in a navy suit"
                width={987}
                height={1164}
                sizes="(max-width: 700px) 85vw, (max-width: 1100px) 36vw, 390px"
                preload
              />
            </div>
            <figcaption>
              <span><Icon name="pin" /> Dhaka, Bangladesh</span>
            </figcaption>
          </figure>
          <aside className={s.heroAside}>
            <a className={s.identityCard} href="#research">
              <Icon name="signal" />
              <h2>
                Images. Signals.
                <br />
                New questions.
              </h2>
              <p>
                Published research and an undergraduate thesis in applied
                machine learning.
              </p>
              <span className={s.cardAction}>
                Explore research <Arrow />
              </span>
            </a>
            <a className={s.identityCard} href="#about">
              <Icon name="study" />
              <h2>
                Always
                <br />
                learning.
              </h2>
              <p>
                Preparing for master’s study in data, AI and the systems behind
                them.
              </p>
              <span className={s.cardAction}>
                More about me <Arrow />
              </span>
            </a>
          </aside>
        </section>
        <div className={s.flowWrap}>
          <FlowExhibit paused={pause} />
        </div>
        <div
          className={s.foundation} data-nav-section="research"
          aria-label="Academic and teaching background"
        >
          <div>
            <strong><Icon name="study" /> Computer Science</strong>
            <span>BSc, East West University</span>
          </div>
          <div>
            <strong><Icon name="award" /> 3.88 / 4.00</strong>
            <span>Magna Cum Laude</span>
          </div>
          <div>
            <strong><Icon name="paper" /> IEEE COMPAS 2024</strong>
            <span>Co-authored conference paper</span>
          </div>
          <div>
            <strong><Icon name="teach" /> Teaching & peer support</strong>
            <span>Teaching assistance across six courses</span>
          </div>
        </div>
        <section id="research" data-nav-section="research" className={s.section}>
          <SectionTitle
            number="01"
            label="RESEARCH & DIRECTION"
            title={
              <>
                Learning from data.
                <br />
                <em>Asking better questions.</em>
              </>
            }
          >
            My research so far explores images and brain signals. I want to
            deepen that foundation through graduate study and connect it with
            the systems I build.
          </SectionTitle>
          <div className={s.researchGrid}>
            {projects
              .filter((p) => p.category === "Research")
              .map((p, i) => (
                <article key={p.id} className={s.paper}>
                  <div className={s.paperTop}>
                    <span className={s.eyebrow}>
                      {i === 0
                        ? "01 / PUBLISHED PAPER"
                        : "02 / UNDERGRADUATE THESIS"}
                    </span>
                    <span aria-hidden="true">{i === 0 ? "↗" : "∿"}</span>
                  </div>
                  <h3>
                    {i === 0
                      ? "Unveiling Microorganism Diversity through Neural Network-driven Classification"
                      : "Decoding Object Shapes from EEG Signals of the Brain"}
                  </h3>
                  <p className={s.paperQuestion}>{p.description}</p>
                  <div className={s.paperBody}>
                    <p className={s.eyebrow}>MY CONTRIBUTION & CONTEXT</p>
                    <p>{p.details}</p>
                  </div>
                  <a
                    className={s.inlineLink}
                    href={p.href}
                    target={i === 0 ? "_blank" : undefined}
                    rel={i === 0 ? "noreferrer" : undefined}
                  >
                    {i === 0 ? "Read the IEEE paper" : "Watch the thesis demo"}
                    <Arrow />
                  </a>
                </article>
              ))}
          </div>
          <div className={s.interests}>
            <p className={s.eyebrow}>WHAT I WANT TO EXPLORE NEXT</p>
            <div>
              <h3><Icon name="chart" /> Learning from data</h3>
              <p>
                Data science, artificial intelligence, analysis and business
                intelligence.
              </p>
            </div>
            <div>
              <h3><Icon name="database" /> Building with data</h3>
              <p>
                Data engineering and big data: the foundations behind useful
                applications.
              </p>
            </div>
            <div>
              <h3><Icon name="workflow" /> Putting it to work</h3>
              <p>
                Software development and workflow automation that solve everyday
                problems.
              </p>
            </div>
          </div>
        </section>
        <section id="work" data-nav-section="work" className={`${s.section} ${s.workSection}`}>
          <SectionTitle
            number="02"
            label="SELECTED PROJECTS"
            title={
              <>
                Ideas that become
                <br />
                <em>something useful.</em>
              </>
            }
          >
            Personal software and tools I’ve built with healthcare operations teams.
          </SectionTitle>
          <TubeVaultProject />
          <div className={s.workIntro}>
            <p className={s.eyebrow}>PROFESSIONAL PRACTICE / COMMURE BD</p>
            <p>
              I help billing teams find missing records and investigate import errors.
            </p>
          </div>
          <div className={s.workGrid}>
            {studies.map((study) => (
              <article className={s.workCard} id={study.id} key={study.id}>
                <Link
                  className={s.workArt}
                  href={`/work/${study.id}`}
                  aria-label={`Read case study: ${titles[study.id]}`}
                >
                  <WorkPreview kind={study.id} />
                </Link>
                <p className={s.eyebrow}>
                  {study.number} / {study.discipline.split(" / ")[0]}
                </p>
                <h3>{titles[study.id]}</h3>
                <p>{study.intro}</p>
                <p className={s.workOutcome}>
                  {study.id === "architecture"
                    ? "96 deprecated logic instances updated / H1 2026"
                    : study.metricLabel}
                </p>
                <Link className={s.inlineLink} href={`/work/${study.id}`}>
                  Read case study <Arrow />
                </Link>
              </article>
            ))}
          </div>
          <div className={s.impact}>
            <p className={s.eyebrow}>2025 / REPORTED IMPACT</p>
            <div>
              <strong>20+</strong>
              <span><Icon name="workflow" /> Workflows built</span>
            </div>
            <div>
              <strong>~70 h</strong>
              <span><Icon name="clock" /> Estimated team time saved / week</span>
            </div>
            <div>
              <strong>$10M+</strong>
              <span><Icon name="ledger" /> Tracked claims value supported</span>
            </div>
            <p className={s.note}>
              Time saving is an estimate, not a measured time study. Claims
              value is operational scope, not revenue recovered. Professional
              examples use synthetic data; individual contributions are
              explained in each case study.
            </p>
          </div>
        </section>
        <section id="about" data-nav-section="about" className={s.section}>
          <h2 className={s.aboutTitle}>About me</h2>
          <div className={s.aboutGrid}>
            <div className={s.personalCopy}>
              <p>
                I’m a computer science graduate in Dhaka. I like building tools
                people choose to use. A small example is the script I wrote for
                our weekly food orders at work. Colleagues asked to use it too.
              </p>
              <a
                className={s.inlineLink}
                href="https://linkedin.com/in/tamim--abdullah"
                target="_blank"
                rel="noreferrer"
              >
                Connect on LinkedIn <Arrow />
              </a>
            </div>
            <aside className={s.personalNote}>
              <p className={s.eyebrow}>Graduate study</p>
              <p>I want to study how to build reliable data pipelines and use
                their output for analysis and machine learning.</p>
            </aside>
          </div>
          <div className={s.background}>
            <div>
              <h3>Education & teaching</h3>
              {[experience[3], experience[2], experience[1]].map((item) => (
                <article key={item.organization + item.role}>
                  <p className={s.eyebrow}>
                    {item.kind === "FOUNDATION" ? "EDUCATION" : item.kind}
                  </p>
                  <h4>
                    {item.role === "East West University"
                      ? item.organization
                      : item.role}
                  </h4>
                  <p className={s.institution}>
                    <OrganizationMark file={item.kind === "TRAINING" ? "bjet.png" : "ewu.png"} />
                    {item.role === "East West University"
                      ? item.role
                      : item.organization}
                  </p>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
            <div>
              <h3>Professional experience</h3>
              <article>
                <p className={s.eyebrow}>FEB 2025 – PRESENT</p>
                <h4>{experience[0].role}</h4>
                <p className={s.institution}><OrganizationMark file="commure.png" />{experience[0].organization}</p>
                <p>Promoted to senior analyst in March 2026.</p>
                <ul className={s.outcomes}>
                  <li>An import-error copilot helped the team resolve approximately <strong>120,000 claims</strong>.</li>
                  <li>Received the Beast Award for the copilot and for automating work on billable claims awaiting submission.</li>
                </ul>
              </article>
              <article>
                <h4>How I work with data</h4>
                <p>I use Python to extract EHR reports and SQL to find missing
                  encounters. Retool brings those checks into the team’s workflow.</p>
              </article>
            </div>
          </div>
        </section>
        <div className={s.archiveWrap} data-nav-section="work">
          <ProjectArchive motionPaused={pause} />
        </div>
        <section
          className={`${s.section} ${s.practice}`}
          aria-labelledby="practice-title"
        >
          <h2 id="practice-title">A connected practice.</h2>
          <PracticeCards paused={pause} />
        </section>
        <div className={s.credentialsWrap} data-nav-section="about">
          <Credentials />
        </div>
        <section className={`${s.section} ${s.documents}`} id="cv">
          <div>
            <h2>CVs</h2>
          </div>
          <div>
            {[cvs[2], cvs[0]].map((cv, i) => (
              <a
                key={cv.file}
                href={`/cv/${cv.file}`}
                className={s.documentLink}
              >
                <span>
                  <Icon name={i === 0 ? "study" : "work"} />
                  <strong>
                    {i === 0 ? "Academic CV" : "Data automation CV"}
                  </strong>
                </span>
                <span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
        </section>
        <section id="contact" data-nav-section="contact" className={`${s.section} ${s.contact}`}>
          <p className={s.eyebrow}>04 / KEEP IN TOUCH</p>
          <div className={s.contactHeading}>
            <h2>
              Good conversations
              <br />
              <em>start somewhere.</em>
            </h2>
            <p>
              Research, graduate study, useful software, or a shared curiosity.
              I’d be glad to hear from you.
            </p>
          </div>
          <div className={s.contactLinks}>
            <a href="mailto:alltamim.abdullah@gmail.com">
              alltamim.abdullah@gmail.com <Arrow />
            </a>
            <button onClick={copyEmail} aria-label="Copy email address" title="Copy email address"><Icon name="copy" /></button>
            <span role="status">{copied}</span>
          </div>
          <div className={s.contactDetails}>
            <ContactForm />
          </div>
          <div className={s.socials}>
            <a
              href="https://github.com/abdullah-al-tamim"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow />
            </a>
            <a
              href="https://linkedin.com/in/tamim--abdullah"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Arrow />
            </a>
          </div>
        </section>
      </main>
      <footer className={s.footer}>
        <span>Abdullah Al Tamim © 2026</span>
        <span>Built with curiosity. Based in Dhaka.</span>
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
