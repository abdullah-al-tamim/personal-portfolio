"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  requireOwner,
  supabaseServer,
  isConfigured,
} from "@/lib/study-hub/server";
import {
  opportunityInput,
  statusInput,
  taskInput,
  canonicalSource,
  isApprovedIdentity,
} from "@/lib/study-hub/validation.mjs";
export async function signIn(_previous, form) {
  if (!isConfigured()) return { error: "Access is not configured yet." };
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (
    email.length > 254 ||
    !email.includes("@") ||
    password.length < 1 ||
    password.length > 256
  )
    return { error: "Check your credentials." };
  const db = await supabaseServer();
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error || !isApprovedIdentity(data.user, process.env.STUDY_HUB_OWNER_ID)) {
    await db.auth.signOut({ scope: "local" });
    return { error: "Unable to sign in with these credentials." };
  }
  const approved = await db.rpc("study_is_owner");
  if (approved.error || approved.data !== true) {
    await db.auth.signOut({ scope: "local" });
    return { error: "This account has not been approved." };
  }
  redirect("/study-hub");
}
export async function signOut() {
  const db = await supabaseServer();
  await db.auth.signOut({ scope: "local" });
  redirect("/study-hub/login");
}
export async function createOpportunity(_previous, form) {
  const { db, user } = await requireOwner();
  const parsed = opportunityInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const input = parsed.data;
  const { data, error } = await db
    .from("study_opportunities")
    .insert({
      ...input,
      owner_id: user.id,
      canonical_url: canonicalSource(input.official_url),
    })
    .select("id")
    .single();
  if (error)
    return {
      error:
        error.code === "23505"
          ? "This opportunity URL is already saved."
          : "Could not save. Check database setup and retry.",
    };
  revalidatePath("/study-hub", "layout");
  redirect(`/study-hub/opportunities/${data.id}`);
}
export async function changeStatus(_previous, form) {
  const { db, user } = await requireOwner();
  const parsed = statusInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Invalid status change." };
  const { data, error } = await db
    .from("study_opportunities")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .eq("owner_id", user.id)
    .select("id")
    .maybeSingle();
  if (error || !data) return { error: "Could not update this opportunity." };
  revalidatePath("/study-hub", "layout");
  return { success: "Status saved." };
}
export async function queueResearch(_previous, form) {
  const { db, user } = await requireOwner();
  const parsed = taskInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Invalid research request." };
  const { error } = await db
    .from("study_agent_tasks")
    .insert({
      ...parsed.data,
      owner_id: user.id,
      inputs: { schema_version: "1.0" },
    });
  if (error && error.code !== "23505")
    return { error: "Unable to queue this request." };
  revalidatePath("/study-hub", "layout");
  return {
    success: "Request saved. Execution is waiting for a worker integration.",
  };
}
