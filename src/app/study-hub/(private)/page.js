import Link from "next/link";
import { requireOwner } from "@/lib/study-hub/server";
import { Header, Empty, Badge } from "@/components/study-hub/Shell";
export default async function Overview() {
  const { db } = await requireOwner();
  const queries = await Promise.all([
    db.from("study_opportunities").select("id", { count: "exact", head: true }),
    db
      .from("study_opportunities")
      .select("id", { count: "exact", head: true })
      .eq("status", "shortlisted"),
    db
      .from("study_agent_tasks")
      .select("id", { count: "exact", head: true })
      .eq("status", "queued"),
    db
      .from("study_opportunities")
      .select("id,title,kind,country,status")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  if (queries.some((q) => q.error))
    throw new Error("Study Hub database unavailable");
  return (
    <>
      <Header eyebrow="THE BIG PICTURE" title="Make room for what’s next.">
        Your graduate admissions workspace. Start with a source, build the
        evidence, then decide.
      </Header>
      <div className="hub-stats">
        {[
          ["Saved opportunities", queries[0].count],
          ["Shortlisted", queries[1].count],
          ["Research requests", queries[2].count],
        ].map(([label, value]) => (
          <section key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
            <span>Live workspace data</span>
          </section>
        ))}
      </div>
      <div className="hub-grid-main">
        <section className="hub-panel">
          <div className="hub-section-title">
            <h2>Recently saved</h2>
            <Link href="/study-hub/opportunities">View all ↗</Link>
          </div>
          {queries[3].data.length ? (
            queries[3].data.map((o) => (
              <Link
                className="hub-list-item"
                key={o.id}
                href={`/study-hub/opportunities/${o.id}`}
              >
                <div>
                  <h3>{o.title}</h3>
                  <p>
                    {o.country} · {o.kind === "phd" ? "PhD" : "Master’s"}
                  </p>
                </div>
                <Badge>{o.status}</Badge>
              </Link>
            ))
          ) : (
            <Empty title="Your shortlist starts here">
              Save your first programme or funded position with its official
              source.
            </Empty>
          )}
          <Link className="hub-button" href="/study-hub/opportunities#add">
            Add an opportunity
          </Link>
        </section>
        <section className="hub-panel hub-accent-panel">
          <p className="hub-eyebrow">TWO PATHWAYS, OPEN OPTIONS</p>
          <h2>Keep both futures in view.</h2>
          <p>
            Evaluate studying with your spouse and going alone initially as
            independent scenarios.
          </p>
          <div className="hub-pathway">
            <span>01</span>
            <div>
              <h3>Travel together</h3>
              <p>Eligibility, funding, timing</p>
            </div>
          </div>
          <div className="hub-pathway">
            <span>02</span>
            <div>
              <h3>Start solo, reunite later</h3>
              <p>Arrival and dependent pathways</p>
            </div>
          </div>
          <p className="hub-muted">
            Immigration assessments will be connected in a later phase. No visa
            conclusions have been generated.
          </p>
        </section>
      </div>
      <div className="hub-notice">
        <strong>Research execution is not connected.</strong> You can save
        requests now; no model calls, emails, or applications run in this
        release.
      </div>
    </>
  );
}
