import { requireOwner } from "@/lib/study-hub/server";
export async function GET() {
  const { db, user } = await requireOwner();
  const tables = [
    "study_document_registry",
    "study_document_requirements",
    "study_document_jobs",
    "study_document_reviews",
    "study_document_events",
  ];
  const result = {
    schema_version: "1.0",
    exported_at: new Date().toISOString(),
    files_included: false,
  };
  for (const table of tables) {
    const { data, error } = await db
      .from(table)
      .select("*")
      .eq("owner_id", user.id)
      .limit(1000);
    if (error) return new Response("Export failed", { status: 500 });
    result[table] = data;
  }
  return Response.json(result, {
    headers: {
      "Content-Disposition":
        'attachment; filename="document-readiness-private.json"',
      "Cache-Control": "private, no-store",
    },
  });
}
