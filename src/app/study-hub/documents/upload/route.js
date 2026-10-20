import { createHash, randomUUID } from "node:crypto";
import { requireOwner } from "@/lib/study-hub/server";
import {
  inspectFile,
  MAX_UPLOAD,
} from "@/lib/study-hub/documents/validation.mjs";
import { z } from "zod";
export const runtime = "nodejs";
export async function POST(request) {
  const { db, user } = await requireOwner();
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host)
    return Response.json({ error: "Origin mismatch" }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > MAX_UPLOAD + 65536)
    return Response.json(
      { error: "Maximum file size is 3 MB." },
      { status: 413 },
    );
  // Bound the entire body even when content-length is absent or forged.
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: "Missing file" }, { status: 400 });
  let total = 0;
  const chunks = [];
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_UPLOAD + 65536) {
      await reader.cancel();
      return Response.json(
        { error: "Maximum file size is 3 MB." },
        { status: 413 },
      );
    }
    chunks.push(value);
  }
  let form;
  try {
    form = await new Response(Buffer.concat(chunks), {
      headers: { "content-type": request.headers.get("content-type") || "" },
    }).formData();
  } catch {
    return Response.json({ error: "Invalid upload" }, { status: 400 });
  }
  const id = form.get("id");
  if (!z.uuid().safeParse(id).success)
    return Response.json({ error: "Invalid document" }, { status: 400 });
  const { data: doc } = await db
    .from("study_document_registry")
    .select("id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (!doc)
    return Response.json({ error: "Document not found" }, { status: 404 });
  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function")
    return Response.json({ error: "Choose a file" }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  let inspected;
  try {
    inspected = inspectFile(bytes, file.name, file.type);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
  const hash = createHash("sha256").update(bytes).digest("hex");
  const { data: duplicate } = await db
    .from("study_documents")
    .select("id")
    .eq("registry_id", id)
    .eq("sha256", hash)
    .maybeSingle();
  if (duplicate)
    return Response.json({ success: "This exact version is already saved." });
  const path = `${user.id}/${id}/${randomUUID()}.${inspected.extension}`;
  const uploaded = await db.storage
    .from("study-documents")
    .upload(path, bytes, { contentType: inspected.mime, upsert: false });
  if (uploaded.error)
    return Response.json(
      { error: "Private upload failed; check storage configuration." },
      { status: 500 },
    );
  const saved = await db.rpc("study_document_command", {
    command: "file",
    p: {
      id,
      path,
      filename: inspected.filename,
      mime: inspected.mime,
      size: bytes.length,
      sha256: hash,
      version_kind: "original",
    },
  });
  if (saved.error)
    return Response.json(
      {
        error:
          "File stored privately, but registration failed. Contact the administrator to reconcile the orphan upload before retrying.",
      },
      { status: 500 },
    );
  return Response.json({
    success:
      "Private version saved. Review every page before marking it verified.",
  });
}
