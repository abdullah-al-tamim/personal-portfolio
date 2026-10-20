import { requireOwner } from "@/lib/study-hub/server";
import { Header, Badge } from "@/components/study-hub/Shell";
export default async function Settings() {
  await requireOwner();
  return (
    <>
      <Header
        eyebrow="WORKSPACE CONFIGURATION"
        title="Connections & boundaries"
      >
        Only connected capabilities should be treated as operational.
      </Header>
      <section className="hub-panel">
        {[
          ["Supabase authentication", "Connected: owner verified"],
          ["PostgreSQL", "Connected: owner access verified"],
          [
            "Private document storage",
            "Policies supplied · upload UI not implemented",
          ],
          ["AI research worker", "Not connected"],
          ["Gmail", "Not connected · sending disabled"],
          ["Scheduled discovery", "Not implemented"],
          [
            "Research import/export",
            "Versioned contract supplied · importer not implemented",
          ],
        ].map(([name, status]) => (
          <div key={name} className="hub-list-item">
            <h3>{name}</h3>
            <Badge>{status}</Badge>
          </div>
        ))}
      </section>
      <div className="hub-notice">
        External communications and final applications require explicit review
        of their exact contents. This release has no external-action endpoints.
      </div>
    </>
  );
}
