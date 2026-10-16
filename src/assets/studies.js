// Public, anonymized narratives from the owner's CVs and 2025 / H1 2026 reviews.
// Metrics retain their original scope; diagrams are illustrative, never production traces.
export const studies = [
  {
    id: "reconciliation",
    number: "01",
    name: "Check what made it across.",
    discipline: "EHR AUTOMATION / 2025",
    intro:
      "Our database receives encounters from EHRs. I automated the report downloads that help our team check whether the counts match.",
    problem:
      "Imports already run, but information can become outdated and rules designed to prevent duplicates can block encounters. Our submissions team had to download EHR reports by hand and compare them with the database.",
    difficulty:
      "Different EHRs require different extraction routines. A count difference needs investigation: it does not mean every missing encounter should be imported again.",
    contribution:
      "I co-developed eClinicalWorks report extraction with Navid Al Azim, then independently extended extraction to Hellonote, NextGen, and AdvancedMD. I helped turn the manual audit into production automation.",
    approach:
      "Python with Playwright and Selenium automates browser-based report extraction. SQL supports the database comparison, and Retool workflows bring the audit together. Separately, our team built import-error resolver workflows that use earlier encounters to suggest missing information; see the third example.",
    outcome:
      "The company decided to bring EHR volume extraction into the product so all operations teams can use it. This describes the integration decision, not a claim that the product rollout is already complete.",
    judgment: "First find the gap. Then understand why it exists.",
    tools: "Python / Playwright / Selenium / SQL / Retool",
    metric: "Into the product",
    metricLabel: "Selected for product integration for all operations teams",
    steps: [
      {
        name: "Extract",
        title: "Download the EHR report automatically.",
        text: "Python drives Playwright or Selenium browser automation to extract encounter reports. The choice of browser tool depends on the EHR integration.",
      },
      {
        name: "Compare",
        title: "Check the report against the database.",
        text: "SQL provides the database side of the audit. In this fictional example, the report contains 120 encounters and the database contains 116: four encounters to investigate.",
      },
      {
        name: "Investigate",
        title: "Give the team a clear discrepancy to investigate.",
        text: "Retool workflows surface the difference. The team checks for stale information, import rules, or import errors. Missing-information errors are handled by the separate workflow shown in example 03.",
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
    name: "Find the missing information.",
    discipline: "TEAM WORK / IMPORT-ERROR RESOLUTION",
    intro:
      "An encounter cannot be imported when required details are missing. Our team built workflows that look at the same patient’s earlier encounters and suggest a solution.",
    problem:
      "An EHR encounter may arrive without a required name, member ID, or another primary field. The import fails, leaving the team to investigate what is missing.",
    difficulty:
      "An earlier encounter may contain the answer, but it needs to belong to the same patient. Historical information is a source of possible solutions, not a reason to overwrite records blindly.",
    contribution:
      "I worked with my team on import-error resolver workflows. This is a team-built capability: identify the error, use that patient’s historical encounters, and provide a proposed solution. My broader error-workflow rollout work included QA, guidance, and validation.",
    approach:
      "Retool workflows identify the missing field and use a SQL lookup of the patient’s encounter history to find supporting information. They surface a proposed solution for the error. The diagram explains this logic; its field values are fictional.",
    outcome:
      "The workflow turns a missing-information error into a proposed solution using context the team already has. It supports the next step in resolving the import error without claiming that every error can be fixed automatically.",
    judgment:
      "An error is more useful when it comes with the context needed to resolve it.",
    tools: "Retool workflows / SQL / Historical encounter lookup / Validation",
    metric: "Error to solution",
    metricLabel:
      "Team-built workflows using the same patient’s encounter history",
    steps: [
      {
        name: "Identify",
        title: "Explain why the import failed.",
        text: "The incoming encounter is missing a member ID. The workflow identifies that missing field instead of leaving the operator with an unexplained failure.",
      },
      {
        name: "Look back",
        title: "Look at the same patient’s earlier encounters.",
        text: "A SQL lookup finds relevant historical encounter information. In this fictional example, an earlier encounter contains the missing member ID.",
      },
      {
        name: "Suggest",
        title: "Provide the missing context as a proposed solution.",
        text: "The Retool workflow presents the historical value as a suggested resolution. This model stops at the suggestion; it does not imply automatic overwriting or a guaranteed successful re-import.",
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
