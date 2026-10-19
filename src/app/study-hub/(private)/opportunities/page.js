import Link from "next/link";
import { requireOwner } from "@/lib/study-hub/server";
import { Header, Empty, Badge } from "@/components/study-hub/Shell";
import { OpportunityForm } from "@/components/study-hub/Forms";
import { statuses } from "@/lib/study-hub/validation.mjs";
export default async function Opportunities({ searchParams }) {
  const { db } = await requireOwner();
  const params = await searchParams;
  const term =
    typeof params.q === "string"
      ? params.q.slice(0, 100).replace(/[%_\\]/g, "")
      : "";
  const page = Math.min(
    10000,
    Math.max(1, Number.parseInt(params.page, 10) || 1),
  );
  let query = db
    .from("study_opportunities")
    .select("id,title,kind,country,funding,status,verification_status", {
      count: "exact",
    });
  if (term) query = query.ilike("title", `%${term}%`);
  if (["masters", "phd"].includes(params.kind))
    query = query.eq("kind", params.kind);
  if (statuses.includes(params.status))
    query = query.eq("status", params.status);
  if (params.funding === "full") query = query.eq("funding", "full");
  const { data, count, error } = await query
    .order(params.sort === "title" ? "title" : "created_at", {
      ascending: params.sort === "title",
    })
    .range((page - 1) * 25, page * 25 - 1);
  if (error) throw new Error("Cannot load opportunities");
  function pageLink(p) {
    const qs = new URLSearchParams();
    for (const key of ["q", "kind", "status", "funding", "sort"])
      if (typeof params[key] === "string") qs.set(key, params[key]);
    qs.set("page", String(p));
    return `/study-hub/opportunities?${qs}`;
  }
  return (
    <>
      <Header
        eyebrow="DISCOVER / ORGANIZE / PURSUE"
        title="Opportunity explorer"
      >
        Master’s programmes and doctoral positions, with every source kept
        close.
      </Header>
      <div className="hub-saved-views">
        <Link href="/study-hub/opportunities">All opportunities</Link>
        <Link href="/study-hub/opportunities?funding=full">
          Full funding reported
        </Link>
        <Link href="/study-hub/opportunities?status=shortlisted">
          Shortlisted
        </Link>
        <Link href="/study-hub/opportunities?status=bookmarked">
          Bookmarked
        </Link>
      </div>
      <div className="hub-grid-main">
        <section className="hub-panel">
          <form className="hub-filters" action="/study-hub/opportunities">
            <label>
              Search
              <input
                name="q"
                defaultValue={term}
                placeholder="Search programme titles"
              />
            </label>
            <label>
              Stream
              <select name="kind" defaultValue={params.kind || ""}>
                <option value="">All streams</option>
                <option value="masters">Master’s</option>
                <option value="phd">PhD</option>
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue={params.status || ""}>
                <option value="">All stages</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Sort
              <select name="sort" defaultValue={params.sort || ""}>
                <option value="">Newest first</option>
                <option value="title">Title A–Z</option>
              </select>
            </label>
            {params.funding === "full" && (
              <input type="hidden" name="funding" value="full" />
            )}
            <button className="hub-button">Apply</button>
          </form>
          <p className="hub-result-count">
            {count} opportunities · Page {page}
          </p>
          {data.length ? (
            <div className="hub-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Funding</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`/study-hub/opportunities/${o.id}`}>
                          {o.title}
                        </Link>
                        <small>
                          {o.country} · {o.kind === "phd" ? "PhD" : "Master’s"}{" "}
                          · {o.verification_status}
                        </small>
                      </td>
                      <td>{o.funding}</td>
                      <td>
                        <Badge>{o.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No opportunities in this view">
              Add an opportunity or adjust your filters.
            </Empty>
          )}
          <div className="hub-pagination">
            {page > 1 && <Link href={pageLink(page - 1)}>← Previous</Link>}
            {page * 25 < count && <Link href={pageLink(page + 1)}>Next →</Link>}
          </div>
        </section>
        <section className="hub-panel" id="add">
          <p className="hub-eyebrow">CAPTURE A POSSIBILITY</p>
          <h2>Add opportunity</h2>
          <OpportunityForm />
        </section>
      </div>
    </>
  );
}
