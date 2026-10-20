import { requireOwner } from "@/lib/study-hub/server";
import { z } from "zod";
export async function GET(request) {
  const { db, user } = await requireOwner();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!z.uuid().safeParse(id).success)
    return new Response("Not found", { status: 404 });
  const { data: f } = await db
    .from("study_documents")
    .select("id,registry_id,storage_path,filename,mime_type")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!f) return new Response("Not found", { status: 404 });
  const { data, error } = await db.storage
    .from("study-documents")
    .download(f.storage_path);
  if (error) return new Response("File unavailable", { status: 404 });
  return new Response(data, {
    headers: {
      "Content-Type": f.mime_type,
      "Content-Disposition": `${url.searchParams.get("download") === "1" ? "attachment" : "inline"}; filename="${f.filename.replace(/[^a-zA-Z0-9._ -]/g, "_")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy":
        "sandbox; default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'",
      "Referrer-Policy": "no-referrer",
    },
  });
}
