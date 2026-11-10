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
import Monogram from "@/components/Monogram";
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
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={s.header}>
        <a
          href="#home"
          className={s.wordmark}
          aria-label="Abdullah Al Tamim: home"
        >
          <Monogram />
          <span>Abdullah Al Tamim</span>
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
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
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
          <FlowBackground paused={pause} />
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>
              <span className={s.dot} /> A CURIOUS MIND. A PRACTICAL APPROACH.
            </p>
            <p className={s.introduction}>Hello, I’m Tamim.</p>
            <h1>
              Making data useful.
              <br />
              <em>Making life easier.</em>
            </h1>
            <p className={s.heroDescription}>
              I love building systems that solve real problems and that people
              enjoy using. My work and curiosity meet across data, AI, and
              software development.
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
              <span>Currently</span> Senior Data Automations Analyst at Commure
              BD.
              <br />
              <span>Next</span> Preparing for master’s study in data and AI.
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
              <span>DHAKA, BANGLADESH</span>
              <span>
                Always learning <Arrow />
              </span>
            </figcaption>
          </figure>
          <aside className={s.heroAside}>
            <a className={s.identityCard} href="#research">
              <span className={s.cardGlyph} aria-hidden="true">
                ⌁
              </span>
              <p className={s.eyebrow}>RESEARCH & CURIOSITY</p>
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
              <p className={s.eyebrow}>BASED IN DHAKA / LOOKING AHEAD</p>
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
          className={s.foundation}
          aria-label="Academic and teaching background"
        >
          <div>
            <strong>Computer Science</strong>
            <span>BSc, East West University</span>
          </div>
          <div>
            <strong>3.88 / 4.00</strong>
            <span>Magna Cum Laude</span>
          </div>
          <div>
            <strong>IEEE COMPAS 2024</strong>
            <span>Co-authored conference paper</span>
          </div>
          <div>
            <strong>Teaching & peer support</strong>
            <span>Teaching assistance across six courses</span>
          </div>
        </div>
        <section id="research" className={s.section}>
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
                      ? "Recognising microorganisms in images"
                      : "Exploring touch through brain signals"}
                  </h3>
                  <p className={s.paperQuestion}>{p.description}</p>
                  <div className={s.paperBody}>
                    <p className={s.eyebrow}>MY CONTRIBUTION & CONTEXT</p>
                    <p>{p.details}</p>
                  </div>
                  <details className={s.details}>
                    <summary>Full research title</summary>
                    <p>
                      {i === 0
                        ? "Unveiling Microorganism Diversity through Neural Network-driven Classification"
                        : "Decoding Object Shapes from EEG Signals of the Brain"}
                    </p>
                  </details>
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
              <h3>Learning from data</h3>
              <p>
                Data science, artificial intelligence, analysis and business
                intelligence.
              </p>
            </div>
            <div>
              <h3>Building with data</h3>
              <p>
                Data engineering and big data: the foundations behind useful
                applications.
              </p>
            </div>
            <div>
              <h3>Putting it to work</h3>
              <p>
                Software development and workflow automation that solve everyday
                problems.
              </p>
            </div>
          </div>
        </section>
        <section id="work" className={`${s.section} ${s.workSection}`}>
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
            From healthcare data workflows to personal software. A selection of
            problems I’ve worked on, with the decisions and contributions behind
            them.
          </SectionTitle>
          <TubeVaultProject />
          <div className={s.workIntro}>
            <p className={s.eyebrow}>PROFESSIONAL PRACTICE / COMMURE BD</p>
            <p>
              In healthcare operations, records from electronic health record
              systems need to reach downstream billing workflows accurately. My
              work helps teams find gaps, investigate errors and reduce repeated
              manual work.
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
              <span>Workflows built</span>
            </div>
            <div>
              <strong>~70 h</strong>
              <span>Estimated team time saved / week</span>
            </div>
            <div>
              <strong>$10M+</strong>
              <span>Tracked claims value supported</span>
            </div>
            <p className={s.note}>
              Time saving is an estimate, not a measured time study. Claims
              value is operational scope, not revenue recovered. Professional
              examples use synthetic data; individual contributions are
              explained in each case study.
            </p>
          </div>
        </section>
        <section id="about" className={s.section}>
          <SectionTitle
            number="03"
            label="A LITTLE ABOUT ME"
            title={
              <>
                The problem matters.
                <br />
                <em>So do the people.</em>
              </>
            }
          />
          <div className={s.aboutGrid}>
            <div className={s.personalCopy}>
              <p>
                I’m Abdullah Al Tamim, a computer science graduate from East
                West University, based in Dhaka. I enjoy the whole process of
                building: understanding a problem, working with the data, and
                developing something people find useful.
              </p>
              <p>
                That interest isn’t limited to large projects. I wrote a small
                script to automate the weekly food-ordering task at work and
                added colleagues who wanted to use it. Their appreciation is
                part of what I enjoy about making things.
              </p>
              <p>
                I’m preparing for master’s study, with interests spanning data
                science and AI, data engineering, analytics and business
                intelligence. I want to keep developing the knowledge behind the
                systems I build.
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
              <p className={s.eyebrow}>A THREAD THROUGH MY WORK</p>
              <p>
                I love building systems that solve real-life problems and that
                people enjoy using.
              </p>
              <span>From research questions to small, useful scripts.</span>
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
                <p className={s.institution}>{experience[0].organization}</p>
                <p>{experience[0].detail}</p>
                <p className={s.note}>
                  Third among 163 contributors to an internal Retool workflow
                  repository. Repository-specific GitHub snapshot, October 2026;
                  private source.
                </p>
              </article>
              <article>
                <p className={s.eyebrow}>TOOLS & METHODS I’VE WORKED WITH</p>
                <h4>From data to working software</h4>
                <p>
                  Python, JavaScript, SQL, PostgreSQL, StarRocks, Retool, APIs,
                  Playwright and Selenium.
                </p>
                <p>
                  Research experience with computer vision, neural networks, EEG
                  signal processing, CWT / FFT, YOLOv8 and Random Forest.
                </p>
              </article>
            </div>
          </div>
        </section>
        <div className={s.archiveWrap}>
          <ProjectArchive motionPaused={pause} />
        </div>
        <section
          className={`${s.section} ${s.practice}`}
          aria-labelledby="practice-title"
        >
          <p className={s.eyebrow}>TOOLS IN SERVICE OF THE PROBLEM</p>
          <h2 id="practice-title">A connected practice.</h2>
          <PracticeCards paused={pause} />
        </section>
        <div className={s.credentialsWrap}>
          <Credentials />
        </div>
        <section className={`${s.section} ${s.documents}`} id="cv">
          <div>
            <p className={s.eyebrow}>THE DETAILS, TO TAKE WITH YOU</p>
            <h2>Continue reading.</h2>
            <p>Academic background, research and professional experience.</p>
          </div>
          <div>
            {[cvs[2], cvs[0]].map((cv, i) => (
              <a
                key={cv.file}
                href={`/cv/${cv.file}`}
                className={s.documentLink}
              >
                <span>
                  <small>
                    {i === 0
                      ? "FOR RESEARCH & HIGHER STUDY"
                      : "FOR PROFESSIONAL CONTEXT"}
                  </small>
                  <strong>
                    {i === 0 ? "Academic CV" : "Data automation CV"}
                  </strong>
                </span>
                <span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
        </section>
        <section id="contact" className={`${s.section} ${s.contact}`}>
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
            <button onClick={copyEmail}>Copy email</button>
            <span role="status">{copied}</span>
          </div>
          <details className={s.contactDetails}>
            <summary>Prefer to leave a message here?</summary>
            <ContactForm />
          </details>
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
