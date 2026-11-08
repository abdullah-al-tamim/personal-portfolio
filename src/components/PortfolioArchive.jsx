"use client";

import Image from "next/image";
import { useState } from "react";

const demos = [
  {
    id: "eeg",
    privateRepo: true,
    title: "EEG shape classification",
    kind: "RESEARCH · UNDERGRADUATE THESIS",
    src: "/projects/EEG.gif",
    alt: "Original EEG thesis recording showing the experimental setup",
    description:
      "A look at the experimental setup behind the unpublished thesis. Further validation was limited by data reliability and equipment.",
    href: "https://github.com/abdullah-al-tamim/Capstone",
    tools: "Signal processing / Machine learning",
  },
  {
    id: "face-attendance",
    title: "Face Attendance System",
    kind: "PERSONAL PROJECT",
    src: "/projects/FaceAttendance.gif",
    alt: "Original recording of the face attendance project",
    description:
      "A Python and Firebase project for face-based attendance, including a check to avoid recording attendance twice on the same day.",
    href: "https://github.com/abdullah-al-tamim/Facial-Recognition-with-Real-Time-Database",
    tools: "Python / Firebase",
  },
  {
    id: "railway",
    title: "Railway Ticket Reservation",
    kind: "ACADEMIC SOFTWARE PROJECT",
    src: "/projects/RTRS.gif",
    alt: "Original railway reservation project walkthrough showing registration and ticketing screens",
    description:
      "Led frontend and backend work on a railway booking system with seat selection, e-tickets, journey history, and administrative scheduling.",
    href: "https://github.com/abdullah-al-tamim/Online-Railway-Ticket-Reservation-System",
    tools: "Django REST / JavaScript / Oracle DB",
  },
];

const certificates = [
  { title: "Beast Award — Level 1: NESSIE", issuer: "Augmedix BD (now Commure BD)", description: "Recognised for an import-error resolver copilot enabling resolution of approximately 120,000 claims and for billable-unsubmitted workflow automation." },
  { title: "B-JET Basic and Basic Plus — completed", issuer: "North South University / University of Miyazaki", date: "June–December 2024", description: "Basic term exam: 99/100; Basic final: 95/100; Basic Plus final: 96.8/100. All Excellent. Combined scheduled instruction: 400 units of 45 minutes." },
  { title: "Giver Award", issuer: "B-JET, 14th Batch", date: "2024", description: "Selected by batchmates through student voting for sustained support to peers throughout training." },
  { title: "Microsoft Azure Administration workshop", issuer: "East West University Robotics Club", date: "13 May 2023", description: "Successfully completed the workshop on Microsoft Azure Administration." },
  {
    title: "SQL (Intermediate)",
    issuer: "HackerRank",
    date: "December 2023",
    image: "/awards/hackerrankSQL.png",
    href: "https://www.hackerrank.com/certificates/712f0a16295e",
  },
  {
    title: "100% Merit Scholarship",
    issuer: "East West University",
    date: "Spring 2022",
    image: "/awards/Merit.png",
    href: "https://drive.google.com/file/d/1Ofq4ntMErU7w6Ths2Kqbw0j4xLywVHPW/view",
  },
  {
    title: "Machine Learning with Tree-Based Models in Python",
    issuer: "DataCamp",
    date: "March 2023",
    image: "/awards/ML2.png",
    href: "https://www.datacamp.com/statement-of-accomplishment/course/8c1e67429eede2afb0a67a660170e22b855920c8",
  },
  {
    title: "Cleaning Data in Python",
    issuer: "DataCamp",
    date: "February 2023",
    image: "/awards/DC.png",
    href: "https://www.datacamp.com/statement-of-accomplishment/course/6f1434f5c3e35cb54cfe3d09966a1d489544be31",
  },
  {
    title: "Feature Engineering for Machine Learning in Python",
    issuer: "DataCamp",
    date: "February 2023",
    image: "/awards/FE.png",
    href: "https://www.datacamp.com/statement-of-accomplishment/course/7ed2195647fe513806dec24c15508b59031219ef",
  },
  {
    title: "Machine Learning for Time Series Data in Python",
    issuer: "DataCamp",
    date: "March 2023",
    image: "/awards/ML.png",
  },
];

function RecordedDemo({ demo, motionPaused }) {
  const [playing, setPlaying] = useState(true);
  return (
    <article
      id={`${demo.id}-demo`}
      className="archive-card"
      tabIndex={-1}
      data-reveal
    >
      <div
        className={`demo-stage ${playing && !motionPaused ? "is-playing" : ""}`}
      >
        {playing && !motionPaused ? (
          <Image
            src={demo.src}
            alt={demo.alt}
            fill
            unoptimized
            sizes="(max-width: 700px) 90vw, 380px"
          />
        ) : (
          <div className="demo-cover" aria-hidden="true">
            <span>FROM THE PROJECT ARCHIVE</span>
            <span className="play-symbol">▷</span>
            <span>{demo.tools}</span>
          </div>
        )}
        <button
          className="demo-control"
          aria-label={`${playing ? "Stop" : "Play"} ${demo.title} recording`}
          disabled={motionPaused}
          aria-pressed={playing && !motionPaused}
          onClick={() => setPlaying(!playing)}
        >
          {motionPaused
            ? "Motion paused"
            : playing
              ? "Stop recording ■"
              : "Play original recording ↗"}
        </button>
      </div>
      <p className="eyebrow">{demo.kind}</p>
      <h3>{demo.title}</h3>
      <p className="archive-description">{demo.description}</p>
      <a
        className="text-link"
        href={demo.href}
        target="_blank"
        rel="noreferrer"
      >
        {demo.privateRepo
          ? "Explore code (private · access required)"
          : "Explore the code"}{" "}
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export function ProjectArchive({ motionPaused }) {
  return (
    <section id="archive" className="archive section-wrap">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">THE PROJECT ARCHIVE</p>
          <h2>Earlier work, in motion.</h2>
        </div>
        <p className="section-aside">
          Original recordings from earlier research and software projects. A
          closer look at the work that shaped how I build.
        </p>
      </div>
      <div className="archive-grid">
        {demos.map((demo) => (
          <RecordedDemo
            key={demo.src}
            demo={demo}
            motionPaused={motionPaused}
          />
        ))}
      </div>
      <p className="work-note">
        Recordings loop automatically. Use Stop on a recording or Pause motion
        in the footer to stop playback.
      </p>
    </section>
  );
}

export function Credentials() {
  return (
    <section
      id="certifications"
      className="credentials section-wrap section-space"
    >
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">CREDENTIALS & RECOGNITION</p>
          <h2>
            Evidence of
            <br />
            <em>continued learning.</em>
          </h2>
        </div>
        <p className="section-aside">
          A selection of certifications and academic recognition, with the
          original certificates to explore.
        </p>
      </div>
      <div className="credential-grid">
        {certificates.map((certificate) => (
          <article
            className="credential-card"
            key={certificate.title}
            data-reveal
          >
            {certificate.image && <a
              className="certificate-image"
              href={certificate.image}
              target="_blank"
              rel="noreferrer"
              aria-label={`View full certificate: ${certificate.title}`}
            >
              <Image
                src={certificate.image}
                alt={`${certificate.title} certificate awarded to Abdullah Al Tamim`}
                fill
                sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 380px"
              />
              <span>VIEW CERTIFICATE ↗</span>
            </a>}
            <div className="credential-copy">
              <p className="eyebrow">
                {certificate.issuer}{certificate.date ? ` · ${certificate.date}` : ""}
              </p>
              <h3>{certificate.title}</h3>
              {certificate.description && <p>{certificate.description}</p>}
              {certificate.href ? (
                <a
                  href={certificate.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  View credential record <span aria-hidden="true">↗</span>
                </a>
              ) : certificate.image ? (
                <a
                  href={certificate.image}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  View original certificate <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

