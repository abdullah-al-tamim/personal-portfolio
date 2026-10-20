import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireOwner } from "@/lib/study-hub/server";
import { Header, Badge } from "@/components/study-hub/Shell";
import {
  StatusForms,
  MetadataForm,
  UploadForm,
  RequirementForm,
  DependencyForm,
} from "@/components/study-hub/documents/Forms";
import { label } from "@/lib/study-hub/documents/catalog.mjs";
export default async function Document({ params }) {
  const { db, user } = await requireOwner();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const results = await Promise.all([
    db
      .from("study_document_registry")
      .select("*")
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle(),
    db
      .from("study_documents")
      .select("id,filename,mime_type,size_bytes,version,created_at,sha256")
      .eq("registry_id", id)
      .eq("owner_id", user.id)
      .order("version", { ascending: false }),
    db.from("study_opportunities").select("id,title").eq("owner_id", user.id),
    db
      .from("study_document_events")
      .select("*")
      .eq("document_id", id)
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30),
    db
      .from("study_document_registry")
      .select("id,title")
      .eq("owner_id", user.id)
      .is("archived_at", null),
    db
      .from("study_document_dependencies")
      .select("*")
      .eq("document_id", id)
      .eq("owner_id", user.id),
    db
      .from("study_document_requirements")
      .select("*")
      .eq("document_id", id)
      .eq("owner_id", user.id),
  ]);
  if (results.some((r) => r.error)) throw new Error("Unable to load document");
  const [
    doc,
    files,
    opportunities,
    events,
    documents,
    dependencies,
    requirements,
  ] = results.map((r) => r.data);
  if (!doc) notFound();
  return (
    <>
      <Link className="hub-back" href="/study-hub/documents">
        ← Document library
      </Link>
      <Header eyebrow={`${doc.category} / ${doc.subject}`} title={doc.title}>
        Possession, scan quality, legalization and application readiness are
        tracked independently.
      </Header>
      <section className="hub-panel doc-job">
        <StatusForms doc={doc} />
        <div className="hub-notice">
          “Verified” records your visual review of the uploaded copy, not legal
          authenticity. To prepare online: verify the scan, set a destination
          and official process URL, then select Ready for online preparation.
        </div>
      </section>
      <div className="hub-grid-main">
        <section className="hub-panel">
          <h2>Private versions</h2>
          <UploadForm id={id} />
          {files.length === 0 && (
            <p className="hub-muted">No uploaded files.</p>
          )}
          {files.map((f) => (
            <article className="doc-version" key={f.id}>
              <Badge>Version {f.version}</Badge>
              <h3>{f.filename}</h3>
              <p className="hub-muted">
                {Math.ceil(f.size_bytes / 1024)} KB ·{" "}
                {new Date(f.created_at).toLocaleDateString("en-GB")}
              </p>
              <div className="doc-actions">
                <a
                  href={`/study-hub/documents/file?id=${f.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Private preview ↗
                </a>
                <a href={`/study-hub/documents/file?id=${f.id}&download=1`}>
                  Download
                </a>
              </div>
            </article>
          ))}
        </section>
        <section className="hub-panel">
          <h2>Details & next step</h2>
          <MetadataForm doc={doc} />
        </section>
      </div>
      <div className="hub-grid-main">
        <section className="hub-panel">
          <h2>Application requirements</h2>
          {requirements.map((r) => (
            <p key={r.id}>
              {r.label} · {r.classification} · {label(r.stage)}
            </p>
          ))}
          <RequirementForm id={id} opportunities={opportunities} />
        </section>
        <section className="hub-panel">
          <h2>Prerequisites</h2>
          {dependencies.map((d) => (
            <p key={d.id}>
              {documents.find((x) => x.id === d.prerequisite_id)?.title}
            </p>
          ))}
          <DependencyForm id={id} documents={documents} />
          <h2>Workflow history</h2>
          <ol className="doc-list">
            {events.map((e) => (
              <li key={e.id}>
                {label(e.axis)}: {label(e.from_value)} → {label(e.to_value)}
                <small>
                  {new Date(e.created_at).toLocaleString("en-GB", {
                    timeZone: "Asia/Dhaka",
                  })}{" "}
                  Dhaka
                </small>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
