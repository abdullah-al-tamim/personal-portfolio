import Link from "next/link";
import { requireOwner } from "@/lib/study-hub/server";
import { Header, Badge, Empty } from "@/components/study-hub/Shell";
import {
  CreateForm,
  JobControls,
  ReviewForm,
} from "@/components/study-hub/documents/Forms";
import {
  initializeChecklist,
  processQueue,
} from "@/app/study-hub/documents/actions";
import {
  label,
  procedures,
  readiness,
} from "@/lib/study-hub/documents/catalog.mjs";
export default async function Documents({ searchParams }) {
  const { db, user } = await requireOwner();
  const filters = await searchParams;
  const view = typeof filters.view === "string" ? filters.view : "library";
  const results = await Promise.all([
    db
      .from("study_document_registry")
      .select("*")
      .eq("owner_id", user.id)
      .is("archived_at", null)
      .order("title"),
    db
      .from("study_document_jobs")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    db
      .from("study_document_reviews")
      .select("*")
      .eq("owner_id", user.id)
      .eq("status", "pending"),
    db.from("study_document_requirements").select("*").eq("owner_id", user.id),
    db.from("study_opportunities").select("id,title").eq("owner_id", user.id),
  ]);
  if (results.some((r) => r.error))
    return (
      <>
        <Header
          eyebrow="DOCUMENTS & ATTESTATION"
          title="Document center setup required"
        />
        <div className="hub-notice">
          The document migration is not available in this environment. Existing
          opportunity research remains available. Apply the reviewed
          document-center migration before using this module.
        </div>
      </>
    );
  const [documents, jobs, reviews, requirements, opportunities] = results.map(
    (r) => r.data || [],
  );
  const q = String(filters.q || "").toLowerCase();
  const visible = documents.filter(
    (d) =>
      (!q ||
        `${d.title} ${d.category} ${d.subject}`.toLowerCase().includes(q)) &&
      (!filters.subject || d.subject === filters.subject),
  );
  const score = readiness(requirements, documents);
  const due = documents.filter(
    (d) =>
      d.due_date &&
      d.due_date <=
        new Date(new Date().getTime() + 30 * 86400000).toISOString().slice(0, 10),
  );
  return (
    <>
      <Header
        eyebrow="DOCUMENTS & ATTESTATION"
        title="Your next chapter, prepared."
      >
        One private home for your records, requirements and next steps.
      </Header>
      <div className="hub-stats">
        <section>
          <p>Document inventory</p>
          <strong>{documents.length}</strong>
          <span>Unknown possession stays unassessed</span>
        </section>
        <section>
          <p>Confirmed requirements ready</p>
          <strong>{score.percent === null ? "—" : `${score.percent}%`}</strong>
          <span>
            {score.ready} of {score.total} confirmed mandatory requirements
          </span>
        </section>
        <section>
          <p>Needs your attention</p>
          <strong>{reviews.length + due.length}</strong>
          <span>
            {reviews.length} plan reviews · {due.length} dates within 30 days
          </span>
        </section>
      </div>
      <nav className="doc-tabs" aria-label="Document views">
        {[
          ["library", "Library"],
          ["board", "Preparation board"],
          ["attestation", "Attestation"],
          ["queue", "Processing queue"],
          ["requirements", "University requirements"],
          ["visa", "Visa documents"],
          ["history", "History"],
        ].map(([key, title]) => (
          <Link
            aria-current={view === key ? "page" : undefined}
            key={key}
            href={`/study-hub/documents?view=${key}`}
          >
            {title}
          </Link>
        ))}
      </nav>
      {view === "library" && (
        <>
          <div className="doc-toolbar">
            <form className="doc-actions">
              <input
                name="q"
                aria-label="Search documents"
                placeholder="Search documents…"
                defaultValue={q}
              />
              <select
                name="subject"
                aria-label="Document owner"
                defaultValue={filters.subject || ""}
              >
                <option value="">All owners</option>
                <option value="self">Me</option>
                <option value="spouse">Spouse</option>
                <option value="sponsor">Sponsor</option>
              </select>
              <button className="hub-button hub-button-secondary">
                Filter
              </button>
            </form>
            <Link prefetch={false} className="hub-source-link" href="/study-hub/documents/export">
              Export private readiness data ↗
            </Link>
          </div>
          {!documents.length && (
            <Empty title="Start with an honest inventory">
              Create a generic checklist below. Every possession and readiness
              status starts as Not assessed.
            </Empty>
          )}
          <div className="doc-cards">
            {visible.map((d) => (
              <Link
                className="doc-card"
                key={d.id}
                href={`/study-hub/documents/${d.id}`}
              >
                <div>
                  <p className="hub-eyebrow">
                    {d.category} / {d.subject}
                  </p>
                  <h2>{d.title}</h2>
                </div>
                <div className="doc-badges">
                  <Badge>{label(d.readiness)}</Badge>
                  <Badge>{label(d.acquisition)}</Badge>
                </div>
                <p className="hub-muted">
                  Digital: {label(d.digital)} · Attestation:{" "}
                  {label(d.attestation)}
                </p>
                <p className="doc-next">
                  {d.next_action || "Assess what you already have"}{" "}
                  <span>↗</span>
                </p>
              </Link>
            ))}
          </div>
          <div className="hub-grid-main">
            <section className="hub-panel">
              <h2>Add a document</h2>
              <CreateForm />
            </section>
            <section className="hub-panel">
              <h2>Build your inventory</h2>
              <p className="hub-muted">
                Add academic, identity, financial and dependent document
                placeholders. This does not make them mandatory and never
                overwrites existing records.
              </p>
              <form action={initializeChecklist}>
                <button className="hub-button">
                  Initialize document checklist
                </button>
              </form>
            </section>
          </div>
        </>
      )}
      {view === "board" && (
        <div className="doc-board">
          {[
            "not_assessed",
            "not_requested",
            "requested",
            "processing",
            "ready_for_collection",
            "collected",
          ].map((status) => (
            <section key={status}>
              <h3>{label(status)}</h3>
              {documents
                .filter((d) => d.acquisition === status)
                .map((d) => (
                  <Link
                    className="doc-board-card"
                    key={d.id}
                    href={`/study-hub/documents/${d.id}`}
                  >
                    {d.title}
                    <small>{label(d.digital)}</small>
                  </Link>
                ))}
            </section>
          ))}
        </div>
      )}
      {view === "attestation" && (
        <>
          <div className="hub-notice">
            No government submission adapter is connected. Plans and
            official-source links are available; login, declarations, uploads
            and payment require a separately reviewed action.
          </div>
          <div className="doc-cards">
            {procedures.map((p) => (
              <section className="doc-card" key={p.key}>
                <p className="hub-eyebrow">Reviewed {p.reviewed}</p>
                <h2>{p.title}</h2>
                <p className="hub-muted">{p.summary}</p>
                <Badge>{p.mode}</Badge>
                <a
                  className="hub-source-link"
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official procedure ↗
                </a>
              </section>
            ))}
          </div>
        </>
      )}
      {["queue", "history"].includes(view) && (
        <>
          <div className="doc-toolbar">
            <p className="hub-muted">
              Internal preparation runs automatically after a valid ready
              transition. Recovery below processes up to 10 queued jobs. No
              model or external submission is used.
            </p>
            <form action={processQueue}>
              <button className="hub-button">Run queued preparation</button>
            </form>
          </div>
          {jobs.length === 0 && (
            <Empty title="No processing jobs yet">
              Verify a scan and select Ready for online preparation to create a
              durable job.
            </Empty>
          )}
          {jobs.map((j) => (
            <section className="hub-panel doc-job" key={j.id}>
              <div className="doc-toolbar">
                <Link href={`/study-hub/documents/${j.document_id}`}>
                  <h2>
                    {documents.find((d) => d.id === j.document_id)?.title ||
                      "Document"}
                  </h2>
                </Link>
                <Badge>{label(j.status)}</Badge>
              </div>
              <p className="hub-muted">
                Attempt {j.attempts} of 3 ·{" "}
                {new Date(j.created_at).toLocaleString("en-GB", {
                  timeZone: "Asia/Dhaka",
                })}{" "}
                Dhaka · {j.id}
              </p>
              {j.plan && (
                <>
                  <h3>Preparation plan</h3>
                  <ul className="doc-list">
                    {j.plan.checks?.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <div className="hub-notice">
                    {j.plan.blockers?.join(". ")}
                  </div>
                </>
              )}
              {j.error_code && <p role="alert">{j.error_code}</p>}
              {reviews
                .filter((r) => r.job_id === j.id)
                .map((r) => (
                  <ReviewForm key={r.id} review={r} />
                ))}
              <JobControls job={j} />
            </section>
          ))}
        </>
      )}
      {view === "requirements" && (
        <>
          {opportunities.map((o) => {
            const req = requirements.filter((r) => r.opportunity_id === o.id);
            const s = readiness(req, documents);
            return (
              <section className="hub-panel doc-job" key={o.id}>
                <h2>
                  <Link href={`/study-hub/opportunities/${o.id}`}>
                    {o.title}
                  </Link>
                </h2>
                <p className="hub-muted">
                  {s.percent === null
                    ? "No confirmed mandatory requirements linked"
                    : `${s.ready}/${s.total} ready (${s.percent}%)`}
                  . Prepared does not mean accepted by the institution.
                </p>
                {req.map((r) => (
                  <p key={r.id}>
                    <Link href={`/study-hub/documents/${r.document_id}`}>
                      {r.label}
                    </Link>{" "}
                    · {r.classification} · {label(r.stage)}
                  </p>
                ))}
              </section>
            );
          })}
        </>
      )}
      {view === "visa" && (
        <>
          <div className="hub-notice">
            Requirements depend on destination, visa category and funding. Do
            not request time-sensitive bank statements or police clearance until
            the actual rule and submission window are known.
          </div>
          <div className="doc-cards">
            {documents
              .filter((d) =>
                ["Visa", "Financial", "Dependent", "Identity"].includes(
                  d.category,
                ),
              )
              .map((d) => (
                <Link
                  className="doc-card"
                  href={`/study-hub/documents/${d.id}`}
                  key={d.id}
                >
                  <h2>{d.title}</h2>
                  <Badge>{label(d.readiness)}</Badge>
                  <p className="hub-muted">
                    {d.destination || "Destination not assessed"} ·{" "}
                    {d.due_date || "Timing not assessed"}
                  </p>
                </Link>
              ))}
          </div>
        </>
      )}
    </>
  );
}
