"use server";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/study-hub/server";
import {
  documentInput,
  transitionInput,
  metadataInput,
} from "@/lib/study-hub/documents/validation.mjs";
import { documentTypes } from "@/lib/study-hub/documents/catalog.mjs";
import { sourceUrl } from "@/lib/study-hub/validation.mjs";
import { z } from "zod";
async function command(db, name, p) {
  const { data, error } = await db.rpc("study_document_command", {
    command: name,
    p,
  });
  if (error)
    return {
      error: error.message?.includes("exception")
        ? "Unable to save; check prerequisites and refresh."
        : error.message?.slice(0, 180) || "Unable to save.",
    };
  revalidatePath("/study-hub", "layout");
  return { success: "Saved.", data };
}
export async function createDocument(_, form) {
  const { db } = await requireOwner();
  const parsed = documentInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Check the title, type and owner." };
  return command(db, "create", parsed.data);
}
export async function initializeChecklist() {
  const { db } = await requireOwner();
  for (const t of documentTypes) {
    const { error } = await db.rpc("study_document_command", {
      command: "create",
      p: {
        title: t.title,
        type_key: t.key,
        category: t.category,
        subject: t.key === "spouse_passport" ? "spouse" : "self",
      },
    });
    if (error) throw new Error("Checklist setup failed; retry is safe.");
  }
  revalidatePath("/study-hub/documents");
}
export async function transitionDocument(_, form) {
  const { db } = await requireOwner();
  const parsed = transitionInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Invalid status change." };
  const result = await command(db, "transition", parsed.data);
  if (!result.error && parsed.data.target === "ready_for_online_preparation") {
    // Job is committed before execution. A request failure leaves durable work recoverable in the queue.
    const { error } = await db.rpc("study_document_process_next");
    if (error)
      return {
        success:
          "Status and job saved. Processing interrupted; use Run queued preparation to resume.",
      };
    revalidatePath("/study-hub/documents", "layout");
  }
  return result;
}
export async function saveMetadata(_, form) {
  const { db } = await requireOwner();
  const parsed = metadataInput.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { error: "Check dates, text lengths and the HTTPS process URL." };
  return command(db, "metadata", parsed.data);
}
export async function linkRequirement(_, form) {
  const { db } = await requireOwner();
  const schema = z.object({
    id: z.uuid(),
    opportunity_id: z.uuid(),
    label: z.string().min(2).max(300),
    stage: z.enum([
      "application",
      "scholarship",
      "conditional_admission",
      "admission",
      "visa",
      "enrolment",
      "dependent_visa",
    ]),
    classification: z.enum([
      "mandatory",
      "conditional",
      "optional",
      "not_required",
      "unverified",
    ]),
    source_url: z.union([sourceUrl, z.literal("")]),
    freshness_days: z.string().regex(/^\d{0,4}$/),
    verified: z.string().optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { error: "Check requirement details and evidence URL." };
  return command(db, "link", {
    ...parsed.data,
    verified: parsed.data.verified === "on",
  });
}
export async function addDependency(_, form) {
  const { db } = await requireOwner();
  const parsed = z
    .object({ id: z.uuid(), prerequisite_id: z.uuid() })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Invalid dependency." };
  return command(db, "dependency", parsed.data);
}
export async function jobAction(_, form) {
  const { db } = await requireOwner();
  const parsed = z
    .object({ id: z.uuid(), target: z.enum(["paused", "queued", "cancelled"]) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Invalid job action." };
  return command(db, "job_control", parsed.data);
}
export async function reviewPlan(_, form) {
  const { db } = await requireOwner();
  const parsed = z
    .object({ id: z.uuid(), decision: z.enum(["approved", "rejected"]) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Invalid decision." };
  return command(db, "review", parsed.data);
}
export async function processQueue() {
  const { db } = await requireOwner();
  for (let i = 0; i < 10; i++) {
    const { data, error } = await db.rpc("study_document_process_next");
    if (error) throw new Error("Could not process queue");
    if (data?.status === "idle") break;
  }
  revalidatePath("/study-hub/documents");
}
