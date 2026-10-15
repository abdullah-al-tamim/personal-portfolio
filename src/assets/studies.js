// Public, anonymized narratives from the owner's CVs and 2025 / H1 2026 reviews.
// Metrics retain their original scope; diagrams are illustrative, never production traces.
export const studies = [
  {
    id: "reconciliation",
    number: "01",
    name: "Reconcile the gaps.",
    discipline: "AUTOMATION / 2025",
    intro:
      "The encounters are already imported. The question is whether the database still reflects what is in the EHR.",
    problem:
      "Existing systems import encounters from EHRs into the database. But information can become outdated, and duplicate-prevention rules can block some encounters. The submissions team had to download encounter reports manually and compare their counts against the database.",
    difficulty:
      "A mismatch is a signal to investigate, not proof that an encounter should be imported again. The audit needs to expose discrepancies while preserving the safeguards that prevent duplicate encounters.",
    contribution:
      "I helped automate and productionalize this encounter audit. I co-developed the eClinicalWorks report extraction with Navid Al Azim, then independently extended extraction automation to Hellonote, NextGen, and AdvancedMD.",
    approach:
      "Automate report extraction from the EHR, compare encounter counts against the database, and surface discrepancies for investigation. This audit runs alongside the existing import system; it does not replace it or bypass duplicate-prevention rules.",
    outcome:
      "Repeated manual report downloads and count comparisons became a production automation for the submissions team. Differences between the EHR and database could be identified through a repeatable audit.",
    judgment:
      "Trust the database enough to use it. Verify it enough to know when it needs attention.",
    tools: "Python · JavaScript · Retool · EHR integrations",
    metric: "Report ↔ DB",
    metricLabel: "Production encounter auditing / existing import retained",
    steps: [
      {
        name: "Existing import",
        title: "Import already exists. Verification is the missing layer.",
        text: "The EHR feeds the database through an existing import system. Updates can lag and duplicate-prevention rules may block encounters. The audit checks the resulting database coverage.",
      },
      {
        name: "Compare counts",
        title: "Replace the manual report-to-database check.",
        text: "Extract an encounter report and compare its count with the corresponding database count. The fictional example shows 120 reported encounters versus 116 in the database: a difference of four to investigate.",
      },
      {
        name: "Review gaps",
        title: "Expose the discrepancy. Preserve the safeguards.",
        text: "The difference becomes audit output for investigation into stale information or import-rule exclusions. A count mismatch does not automatically authorize importing or resubmitting encounters.",
      },
    ],
  },
  {
    id: "architecture",
    number: "02",
    name: "Break the bottleneck.",
    discipline: "WORKFLOW ARCHITECTURE / H1 2026",
    intro:
      "When a tool grows, the original query can become the bottleneck. I reworked the architecture beneath the interface.",
    problem:
      "The Submissions Funnel and Error Tracker needed to handle large, complex operational datasets. Heavy queries and tightly coupled processing made the architecture harder to scale.",
    difficulty:
      "Simply adding more work to the same process increases dependencies. Splitting execution also introduces coordination and cache-freshness questions that the interface needs to handle deliberately.",
    contribution:
      "I re-architected both Retool applications with parallel chunk-based processing and localized Retool DB caching, then applied the approach to the Enrollment Deep Dive Dashboard. I migrated heavy queries to StarRocks and updated 96 instances of deprecated logic.",
    approach:
      "Partition independent work, execute chunks in parallel, and reuse localized data rather than repeating the entire query path for every interaction. The model below shows the structural difference without inventing timing benchmarks.",
    outcome:
      "Parallel processing and local caching replaced the earlier monolithic approach. The verified implementation included 96 logic updates; no public latency benchmark is available.",
    judgment:
      "The right optimization changes the shape of the work, not just the speed of one query.",
    tools: "SQL · Retool DB · StarRocks · JavaScript",
    metric: "96",
    metricLabel: "Deprecated logic instances updated / H1 2026",
    steps: [
      {
        name: "Before",
        title: "One dependent sequence.",
        text: "A conceptual serial path: each chunk waits for the preceding work. This is a structural illustration, not a production performance trace.",
      },
      {
        name: "Parallel",
        title: "Independent work, coordinated.",
        text: "Chunks can execute in parallel and converge into a common result. The benefit depends on workload and downstream capacity.",
      },
      {
        name: "Cache",
        title: "Avoid doing the same work twice.",
        text: "Localized Retool DB caching provides a reusable data layer. Freshness remains a design concern; no invented refresh policy is shown here.",
      },
    ],
  },
  {
    id: "intelligence",
    number: "03",
    name: "Make the next action clear.",
    discipline: "OPERATIONAL INTELLIGENCE / 2025–26",
    intro:
      "A dashboard should help someone act. Visibility alone does not resolve a claim or assign responsibility.",
    problem:
      "Submission errors and ownership information needed to be understandable to the people resolving them, as well as to stakeholders reviewing operational progress.",
    difficulty:
      "Different claim conditions need different guidance. A single aggregate count can conceal the context required to decide who should act and what they should do next.",
    contribution:
      "I owned the Submission Error Tracker used by US stakeholders for audits and rebuilt responsibility routing with claim-specific action guidance for three major pre-submission categories. I also supported new error-workflow rollout through QA, guidance, and validation.",
    approach:
      "Connect error classification with responsibility and action guidance. Keep unresolved work visible alongside the operational summary. The illustrative routing model uses invented category labels and no actual claims.",
    outcome:
      "The resulting tools connected monitoring with operational follow-through. Across my broader 2025 work, the tracked claims value supported exceeded $10M; this is not revenue generated or recovered.",
    judgment:
      "A useful metric points to a decision. A useful internal tool makes that decision easier to carry out.",
    tools: "SQL · Retool · Operational reporting · Workflow validation",
    metric: "3",
    metricLabel: "Pre-submission categories with action guidance",
    steps: [
      {
        name: "Observe",
        title: "See the unresolved work.",
        text: "Operational records need enough context to distinguish a data problem from a process problem.",
      },
      {
        name: "Assign",
        title: "Connect context to responsibility.",
        text: "Category-specific guidance helps a reviewer understand the appropriate next action. Labels in this demonstration are fictional.",
      },
      {
        name: "Follow through",
        title: "Monitoring meets execution.",
        text: "A clear route from a summary to an actionable record makes the tool useful to both operators and stakeholders.",
      },
    ],
  },
];

export const experience = [
  {
    period: "FEB 2025 — PRESENT",
    organization: "Augmedix / Commure | Athelas",
    role: "Senior Data Automations Analyst",
    detail:
      "Promoted to Senior in March 2026. Automation architecture, healthcare data workflows, operational reporting, and internal tools.",
    kind: "PRACTICE",
  },
  {
    period: "APR 2022 — MAY 2024",
    organization: "East West University",
    role: "Undergraduate & Graduate Teaching Assistant",
    detail:
      "Tutoring, project support, and assessment across six courses, including Algorithms, Database Systems, and Artificial Intelligence.",
    kind: "TEACHING",
  },
  {
    period: "JAN 2020 — JUN 2024",
    organization: "BSc, Computer Science & Engineering",
    role: "East West University",
    detail: "CGPA 3.88/4.00 · Magna Cum Laude · 100% merit scholarship.",
    kind: "FOUNDATION",
  },
];
export const disciplines = [
  {
    title: "Workflow engineering",
    detail:
      "Python, JavaScript, asynchronous orchestration, Retool, REST APIs, Selenium & Playwright.",
  },
  {
    title: "Data & operations",
    detail:
      "Advanced SQL, PostgreSQL, StarRocks, reconciliation, data validation, operational dashboards & healthcare revenue cycle automation.",
  },
  {
    title: "Applied intelligence",
    detail:
      "Machine learning, computer vision, EEG signal processing, model training & AI-assisted engineering.",
  },
];
