// Confirmed public career facts. Preserve reporting periods and shared ownership.
export const projects = [
  {
    id: "workflow",
    category: "Automation",
    number: "01",
    period: "PROFESSIONAL WORK · 2025",
    title: "Less repetition. More reliable operations.",
    description:
      "EHR extraction and claim workflows that turn recurring manual work into repeatable, safeguarded processes.",
    tags: ["Python", "Retool", "Workflow automation"],
    visual: "pipeline",
    outcome: "20+ workflows · approximately 70 team hours saved weekly",
    details:
      "Co-developed the Bangladesh team’s first automated eClinicalWorks encounter-volume extraction with Navid Al Azim, then independently extended automation to Hellonote, NextGen, and AdvancedMD. Built three billable-unsubmitted claim workflows and added validation and safeguards. The weekly team time saving is an estimate from 2025, not a measured time study.",
  },
  {
    id: "analytics",
    category: "Analytics",
    number: "02",
    period: "PROFESSIONAL WORK · H1 2026",
    title: "A stronger foundation for operational data.",
    description:
      "Reworking query architecture so internal tools can handle complex submission and enrollment workflows.",
    tags: ["SQL", "StarRocks", "Retool"],
    visual: "query",
    outcome: "Parallel processing · local caching · 96 logic updates",
    details:
      "Re-architected the Submissions Funnel and Error Tracker with parallel chunk-based processing and localized Retool DB caching. Applied the approach to the Enrollment Deep Dive Dashboard, migrated heavy queries to StarRocks, and updated 96 instances of deprecated logic. Rebuilt responsibility routing with claim-specific action guidance.",
  },
  {
    id: "microorganisms",
    category: "Research",
    number: "03",
    period: "PUBLISHED RESEARCH · IEEE COMPAS 2024",
    title: "Exploring the microscopic with neural networks.",
    description:
      "Image-based microorganism classification, connecting data preparation with applied machine learning.",
    tags: ["Python", "Computer vision", "Neural networks"],
    visual: "neural",
    outcome: "Conference paper · co-author",
    details:
      "Unveiling Microorganism Diversity through Neural Network-driven Classification. My contributions included preprocessing code, model training, and writing sections of the paper. Published in the 2024 IEEE International Conference on Computing, Applications and Systems (COMPAS), pp. 1–5.",
    href: "https://doi.org/10.1109/COMPAS60761.2024.10796528",
    link: "Read the publication",
  },
  {
    id: "eeg",
    category: "Research",
    number: "04",
    period: "UNDERGRADUATE THESIS · EAST WEST UNIVERSITY",
    title: "Learning from signals of the brain.",
    description:
      "An exploration of touch-based object-shape classification using EEG signals and machine learning.",
    tags: ["Signal processing", "CWT / FFT", "Machine learning"],
    visual: "signal",
    outcome: "Four-person team · team lead · unpublished thesis",
    details:
      "Supervised by Dr. Ahmed Wasif Reza, Professor at East West University. Led a four-person team, built models, transformed EEG signals using CWT and FFT, and assisted with data collection. Explored YOLOv8 models with a Random Forest classifier. Further validation was limited by data reliability, equipment, and funding; the work remains unpublished.",
    href: "#eeg-demo",
    link: "Watch the EEG demo",
  },
];
export const capabilities = [
  {
    number: "01",
    title: "Automate the repetitive.",
    description:
      "EHR extraction, scheduled workflows, validation, and practical internal tools that give teams time back.",
    tools: "Python / JavaScript / Retool / APIs",
  },
  {
    number: "02",
    title: "Make the data useful.",
    description:
      "SQL analysis, query architecture, operational dashboards, and careful checks that support better decisions.",
    tools: "SQL / StarRocks / Retool DB / Excel",
  },
  {
    number: "03",
    title: "Explore what comes next.",
    description:
      "Hands-on research in image classification and signal processing, with a focus on sound preparation and honest evaluation.",
    tools: "Python / Neural networks / Computer vision / EEG",
  },
];
export const cvs = [
  {
    title: "Data automation",
    detail: "Engineering & analyst roles",
    file: "Abdullah_Al_Tamim_Data_Automations_Analyst.pdf",
  },
  {
    title: "Operations",
    detail: "Processes & operational delivery",
    file: "Abdullah_Al_Tamim_Operations_Analyst.pdf",
  },
  {
    title: "Academic",
    detail: "Research & higher study",
    file: "Abdullah_Al_Tamim_Academic_CV.pdf",
  },
];
