import { z } from "zod";
export const statuses = [
  "discovered",
  "bookmarked",
  "shortlisted",
  "preparing",
  "submitted",
  "rejected",
];
export const agentKinds = [
  "discovery",
  "verification",
  "professor_research",
  "eligibility",
  "funding",
  "immigration",
  "application_preparation",
  "outreach_draft",
  "deadline_monitor",
];
// This validates stored links, NOT permission to fetch them. No URL fetcher is exposed.
export const sourceUrl = z
  .string()
  .trim()
  .max(2048)
  .url()
  .refine((value) => {
    const u = new URL(value);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.port &&
      !u.hostname.includes(":") &&
      !/^\d+\./.test(u.hostname) &&
      u.hostname.includes(".") &&
      !/(^|\.)(localhost|local|internal|test|invalid)$/.test(u.hostname)
    );
  }, "Use a public HTTPS source URL without credentials or a custom port.");
export const opportunityInput = z.object({
  title: z.string().trim().min(3).max(200),
  kind: z.enum(["masters", "phd"]),
  country: z.string().trim().min(2).max(80),
  official_url: sourceUrl,
  funding: z.enum(["unknown", "full", "partial", "none"]),
  notes: z.string().trim().max(5000).default(""),
});
export const statusInput = z.object({ id: z.uuid(), status: z.enum(statuses) });
export const taskInput = z.object({
  opportunity_id: z.uuid(),
  kind: z.enum(agentKinds),
  idempotency_key: z.uuid(),
});
export const evidenceInput = z.object({
  url: sourceUrl,
  title: z.string().min(1).max(300),
  published_at: z.iso.datetime().nullable(),
  retrieved_at: z.iso.datetime(),
  excerpt: z.string().max(10000),
});
export const researchImport = z
  .object({
    schema_version: z.literal("1.0"),
    external_id: z.string().min(1).max(200),
    opportunity: opportunityInput,
    findings: z
      .array(
        z.object({
          claim: z.string().min(1).max(5000),
          source_indexes: z.array(z.number().int().nonnegative()).min(1),
          verification: z.literal("unverified"),
        }),
      )
      .max(100),
    sources: z.array(evidenceInput).min(1).max(100),
  })
  .superRefine((v, ctx) => {
    for (const f of v.findings)
      if (f.source_indexes.some((i) => i >= v.sources.length))
        ctx.addIssue({
          code: "custom",
          message: "Finding references a missing source.",
        });
  });
export function canonicalSource(value) {
  const u = new URL(sourceUrl.parse(value));
  u.hash = "";
  for (const key of [...u.searchParams.keys()])
    if (/^(utm_|fbclid$|gclid$)/i.test(key)) u.searchParams.delete(key);
  u.searchParams.sort();
  return u.toString();
}
export function isApprovedIdentity(user, allowedId) {
  return Boolean(
    user?.id && allowedId && user.id === allowedId && user.email_confirmed_at,
  );
}
