import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isApprovedIdentity } from "./validation.mjs";
export function isConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_PUBLISHABLE_KEY &&
    process.env.STUDY_HUB_OWNER_ID,
  );
}
export async function supabaseServer() {
  if (!isConfigured()) throw new Error("Study Hub is not configured.");
  const jar = await cookies();
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/study-hub",
      },
      cookies: {
        getAll: () => jar.getAll(),
        setAll(values) {
          try {
            values.forEach(({ name, value, options }) =>
              jar.set(name, value, options),
            );
          } catch {
            /* Server components cannot write; the scoped proxy refreshes cookies. */
          }
        },
      },
    },
  );
}
export async function requireOwner() {
  if (!isConfigured()) redirect("/study-hub/login");
  const db = await supabaseServer();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !isApprovedIdentity(user, process.env.STUDY_HUB_OWNER_ID))
    redirect("/study-hub/login");
  const { data: approved, error: approvalError } =
    await db.rpc("study_is_owner");
  if (approvalError || approved !== true)
    redirect("/study-hub/login?error=access");
  return { db, user };
}
