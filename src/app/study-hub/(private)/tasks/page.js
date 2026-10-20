import { requireOwner } from "@/lib/study-hub/server";
import { Header, Empty, Badge } from "@/components/study-hub/Shell";
export default async function Tasks() {
  const { db } = await requireOwner();
  const { data, error } = await db
    .from("study_agent_tasks")
    .select("id,kind,status,created_at,attempts")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Unable to load research queue");
  return (
    <>
      <Header eyebrow="DURABLE REQUESTS" title="Research queue">
        Requests survive navigation and sign-out. Showing the latest 100.
      </Header>
      <div className="hub-notice">
        Worker not connected. Queued requests will not execute until the Phase 3
        worker is deployed.
      </div>
      <section className="hub-panel">
        {data.length ? (
          data.map((t) => (
            <div className="hub-list-item" key={t.id}>
              <div>
                <h3>{t.kind.replaceAll("_", " ")}</h3>
                <p>
                  {new Date(t.created_at).toISOString()} · Attempts:{" "}
                  {t.attempts}
                </p>
                <small>{t.id}</small>
              </div>
              <Badge>{t.status}</Badge>
            </div>
          ))
        ) : (
          <Empty title="Nothing waiting for research">
            Open an opportunity and choose a research action.
          </Empty>
        )}
      </section>
    </>
  );
}
