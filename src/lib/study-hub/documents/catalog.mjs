// Generic checklist only. Personal possession/status data never ships in Git.
export const documentTypes = [
  ["ssc_certificate", "SSC certificate", "Academic"],
  ["ssc_transcript", "SSC marksheet", "Academic"],
  ["hsc_certificate", "HSC certificate", "Academic"],
  ["hsc_transcript", "HSC marksheet", "Academic"],
  ["degree", "Bachelor’s original certificate", "Academic"],
  ["provisional", "Provisional degree certificate", "Academic"],
  ["transcript", "University transcript", "Academic"],
  ["moi", "Medium of Instruction certificate", "Academic"],
  ["grading", "University grading scale", "Academic"],
  ["syllabus", "Course descriptions", "Academic"],
  ["distinction", "Academic distinction certificate", "Academic"],
  ["merit", "Merit scholarship evidence", "Academic"],
  ["passport", "Passport", "Identity"],
  ["birth", "Birth certificate", "Identity"],
  ["nid", "National identity document", "Identity"],
  ["ielts", "IELTS result", "Tests"],
  ["toefl", "TOEFL / alternative English test", "Tests"],
  ["gre", "GRE result", "Tests"],
  ["academic_cv", "Academic CV", "Application"],
  ["europass", "Europass CV", "Application"],
  ["sop", "Statement of Purpose", "Application"],
  ["proposal", "Research proposal", "Application"],
  ["references", "Recommendation letters", "Application"],
  ["portfolio", "Project / research evidence", "Application"],
  ["employment", "Employment verification", "Application"],
  ["bank", "Bank statements", "Financial"],
  ["solvency", "Bank solvency certificate", "Financial"],
  ["sponsor", "Financial sponsorship documents", "Financial"],
  ["award", "Scholarship award letter", "Financial"],
  ["admission", "Admission letter", "Visa"],
  ["police", "Police clearance", "Visa"],
  ["medical", "Medical examination", "Visa"],
  ["insurance", "Health insurance", "Visa"],
  ["marriage", "Marriage certificate", "Dependent"],
  ["spouse_passport", "Spouse passport", "Dependent"],
  ["translation", "Certified translations", "Dependent"],
].map(([key, title, category]) => ({ key, title, category }));
export const states = {
  acquisition: [
    "not_assessed",
    "not_requested",
    "request_prepared",
    "requested",
    "processing",
    "ready_for_collection",
    "collected",
    "unavailable",
    "not_required",
  ],
  digital: [
    "not_assessed",
    "no_copy",
    "scan_needed",
    "uploaded",
    "quality_review",
    "verified",
    "revision_required",
  ],
  attestation: [
    "not_assessed",
    "not_required",
    "required",
    "awaiting_prerequisites",
    "ready_for_online_preparation",
    "preparing",
    "awaiting_approval",
    "approved",
    "submitted",
    "processing",
    "completed",
    "rejected",
    "manual_required",
  ],
  translation: [
    "not_assessed",
    "not_required",
    "required",
    "in_progress",
    "completed",
  ],
  readiness: [
    "not_assessed",
    "missing",
    "in_progress",
    "ready",
    "expired",
    "needs_updating",
    "not_applicable",
  ],
};
export const label = (value) =>
  String(value || "not_assessed").replaceAll("_", " ");
export const procedures = [
  {
    key: "mygov_ssc",
    title: "SSC certificate / transcript attestation",
    url: "https://www.mygov.bd/services/info?id=BDGS-1722229346",
    reviewed: "2026-10-20",
    summary:
      "This service lists JPG/JPEG/PNG up to 1 MB, BDT 200 per page and five working days. Confirm the issuing board and destination before selecting it. Login, final submission and payment require your participation. Tracking is available after submission.",
    mode: "Preparation only; no live submission adapter",
  },
  {
    key: "apostille",
    title: "Bangladesh certification chain",
    url: "https://mofa-servicedirectory.apostille.mygov.bd/chain-of-legalization",
    reviewed: "2026-10-20",
    summary:
      "The directory lists education board → Ministry of Education → MOFA for SSC/HSC; university → Ministry of Education → MOFA for degrees. This describes a certification chain, not a universal requirement to legalize every document. Check destination recognition and institution acceptance separately.",
    mode: "Research checklist; destination verification required",
  },
  {
    key: "ewu",
    title: "East West University acquisition",
    url: "https://www.ewubd.edu/notice-details/notice-online-graduation-application-26th-convocation-2027",
    reviewed: "2026-10-20",
    summary:
      "Official graduation notice confirms a Controller of Examinations process. It is not a verified collection procedure for earlier graduates. Confirm original-certificate release, transcript, MOI, fees and collection arrangements with the Controller before requesting or paying.",
    mode: "Manual / institutional confirmation required",
  },
  {
    key: "europass",
    title: "Official Europass CV builder",
    url: "https://europass.europa.eu/en/create-europass-cv",
    reviewed: "2026-10-20",
    summary:
      "The official builder creates downloadable CVs from your profile. Prepare accurate education and employment details, then create the official export there. A local draft is not an official Europass export.",
    mode: "Official website; no automatic account integration",
  },
];
export function readiness(
  requirements,
  documents,
  today = new Date().toISOString().slice(0, 10),
) {
  const mandatory = requirements.filter(
    (r) => r.classification === "mandatory" && r.source_url && r.verified_at,
  );
  const ready = mandatory.filter((r) => {
    const d = documents.find((d) => d.id === r.document_id);
    return (
      d &&
      d.readiness === "ready" &&
      (!d.expiry_date || d.expiry_date >= today) &&
      (!r.freshness_days ||
        (d.issue_date &&
          (Date.parse(today) - Date.parse(d.issue_date)) / 86400000 <=
            r.freshness_days))
    );
  });
  return {
    total: mandatory.length,
    ready: ready.length,
    percent: mandatory.length
      ? Math.round((100 * ready.length) / mandatory.length)
      : null,
  };
}
