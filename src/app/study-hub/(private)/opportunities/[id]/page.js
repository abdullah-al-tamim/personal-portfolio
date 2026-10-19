import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { requireOwner } from "@/lib/study-hub/server";
import { Header, Badge } from "@/components/study-hub/Shell";
import { StatusForm, TaskForm } from "@/components/study-hub/Forms";
import { sourceUrl } from "@/lib/study-hub/validation.mjs";
export default async function Opportunity({ params }) {
  const { db } = await requireOwner();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { data: o, error } = await db
    .from("study_opportunities")
    .select(
      "id,title,kind,country,funding,status,verification_status,official_url,notes",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Unable to load opportunity");
  if (!o) notFound();
  return (
    <>
      <Link href="/study-hub/opportunities" className="hub-back">
        ← Opportunities
      </Link>
      <Header
        eyebrow={`${o.kind === "phd" ? "PHD POSITION" : "MASTER’S PROGRAMME"} / ${o.country}`}
        title={o.title}
      >
        <Badge>{o.verification_status}</Badge>
      </Header>
      <div className="hub-grid-main">
        <section className="hub-panel">
          <h2>Source & context</h2>
          <p className="hub-muted">
            Reported funding: {o.funding}. Funding and eligibility require
            independent verification.
          </p>
          {sourceUrl.safeParse(o.official_url).success && (
            <a
              className="hub-source-link"
              href={o.official_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open original source ↗
            </a>
          )}
          <h3>Private notes</h3>
          <p className="hub-notes">{o.notes || "No notes recorded."}</p>
          <div className="hub-notice">
            No immigration assessment yet. Both spouse-accompanied and
            solo-first options remain open.
          </div>
          <h3>Research next steps</h3>
          <TaskForm id={id} requestId={randomUUID()} />
        </section>
        <section className="hub-panel">
          <h2>Application pipeline</h2>
          <StatusForm opportunity={o} />
          <div className="hub-notice">
            “Submitted” records your manual update. It does not submit an
            application.
          </div>
          <p className="hub-muted">
            Email sending, document uploads, and institutional submissions are
            not enabled.
          </p>
        </section>
      </div>
    </>
  );
}
