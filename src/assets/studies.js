// Public, anonymized narratives from the owner's CVs and 2025 / H1 2026 reviews.
// Metrics retain their original scope; diagrams are illustrative, never production traces.
export const studies = [
  {
    id: "reconciliation",
    number: "01",
    name: "Reconcile the gaps.",
    discipline: "AUTOMATION / 2025",
    intro:
      "A record can exist in one system and disappear from the next. The work begins by making that gap visible.",
    problem:
      "Healthcare operations depended on repeated extraction and manual comparisons to find encounters and claims that had not moved through the submission process.",
    difficulty:
      "Different EHRs exposed different data and behaviors. Automating a happy path was only part of the problem: incomplete inputs and import failures still needed a safe route back to a person.",
    contribution:
      "I co-developed the Bangladesh team’s first eClinicalWorks encounter extraction with Navid Al Azim, then independently extended automation to Hellonote, NextGen, and AdvancedMD. I built three scheduled billable-unsubmitted claim workflows and safe Retool triggers for remediation.",
    approach:
      "Extract the relevant records, reconcile what is missing, validate the candidates, and route exceptions before triggering the next operation. The diagram is an anonymized explanation of that approach, not a reconstruction of an employer system.",
    outcome:
      "Extraction and remediation work reduced an import-error backlog from approximately 18,000 to 4,000 in three weeks in 2025. This describes backlog size, not an error rate or revenue recovered.",
    judgment:
      "An automation is useful only when someone can understand what it did—and what it deliberately left for review.",
    tools: "Python · JavaScript · Retool · EHR integrations",
    metric: "18k → 4k",
    metricLabel: "Approx. import-error backlog / three weeks, 2025",
    steps: [
      {
        name: "Reconcile",
        title: "Find what did not arrive.",
        text: "Compare source records with the downstream set. Missing records become candidates for further checking, not automatic resubmission.",
      },
      {
        name: "Validate",
        title: "Keep uncertainty visible.",
        text: "Separate eligible candidates from records that need investigation. The amber branch represents human review; it is not discarded data.",
      },
      {
        name: "Route",
        title: "Give every record a next step.",
        text: "Validated work can proceed through a controlled workflow. Exceptions remain visible with an actionable owner or explanation.",
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
