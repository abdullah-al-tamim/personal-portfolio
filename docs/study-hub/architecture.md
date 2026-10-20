# Architecture decision and repository audit

## Audit baseline

Audited the pinned `main` commit `767c422be18bdc8bd52d32fb39564649d10c0afa` on 2026-10-19 using the GitHub connector. Direct cloning was unavailable; source files and the two required font binaries were retrieved through the connector. The corresponding tree is `47e2252c8041edaa0380acc4a6b8d0f7961a8252`. This is not a claimed deployment commit.

| Area | Finding |
| --- | --- |
| Framework | Next.js 16.4.0 App Router, React / React DOM 19.3.0 |
| Language | JavaScript / JSX; new domain contracts are TypeScript and checked separately |
| Routing | `src/app/page.js`, static `/work/[slug]` case studies, robots, sitemap and OG image |
| Styling | Existing global CSS, Tailwind 3, bundled Geist fonts |
| Package manager | npm, committed package-lock, Node 22.x declared |
| Existing data | Portfolio content in `src/assets`; not an admissions database |
| Existing services | Contact form library / EmailJS integration; not reused for private outreach |
| Authentication / database | None found in the audited source or dependency manifest |
| Hosting | Vercel deployment URL supplied by the owner; no `vercel.json` in the tree; project dashboard settings were not inspected |
| CI | GitHub Actions on PR / main: Node 22, npm ci, lint, node tests, build |
| Instructions | Root AGENTS.md requires reading installed Next.js docs; authentication, server actions and cookie guides were read |

## Decision: integrate a separate route boundary in the existing app

Use `/study-hub` with a scoped stylesheet, server-only Supabase client, protected route group, and a route-scoped Next.js proxy. The repository is already compatible with server rendering and server actions. Introducing a second Next.js deployment would add routing, authentication origin and deployment configuration without improving the database permission boundary in this release.

Public pages remain static. Private pages are dynamic and no-store. The root layout still supplies fonts; no public application components are replaced. Supabase credentials and approved identity are read only by server modules. No service-role key is needed by the web app.

Tradeoff: shared deployment and same origin are not hard process isolation. A compromise of the public app could affect same-origin private sessions. Keep third-party scripts restricted; the current additions introduce none. If stronger isolation becomes necessary, extract the hub into `apps/study-hub` and deploy to a separate origin with separate secrets. This migration is a future decision, not a hidden rewrite of the public site.

## Request and trust boundaries

1. Scoped proxy refreshes the Supabase session and redirects unauthenticated/unapproved UUIDs early; it adds private caching, noindex, frame and referrer protections.
2. Every private page, private layout, and data mutation independently calls `requireOwner()`.
3. `requireOwner()` calls `auth.getUser()` (server-verified identity), requires a confirmed email and exact `STUDY_HUB_OWNER_ID`, and checks `study_is_owner()` in the database.
4. Database reads and writes use the publishable key plus that user's session. Row-level policies require the same authenticated UUID and membership in a non-exposed allowlist.
5. RLS and column-level grants reject writes outside the implemented surface. Ownership, verification state, audit events, agent execution, approvals, and external actions cannot be rewritten by the web client.
6. Database triggers append metadata-only audit events in the same transaction as each mutation. Events include actor, entity, operation and changed-column names, avoiding copies of passwords, emails or documents.

Sign-out only invalidates the caller's local session. Signup, password reset and MFA enrollment are not exposed by this release; provision and recover the sole owner through trusted administration tooling.

## Relational model

All `study_*` tables have UUID IDs, ownership, creation/update timestamps, and `(id, owner_id)` uniqueness. Composite foreign keys prevent cross-owner associations. No private data is stored in Git.

| Domain | Tables and cardinality |
| --- | --- |
| Institutions | universities → programmes / laboratories / professors |
| Funding | programmes ↔ scholarships through programme_scholarships; opportunities ↔ scholarships through opportunity_scholarships |
| Recruitment | professors / laboratories → recruitment_posts; professor → many opportunities |
| Opportunities | optional programme, professor and recruitment-post links; master’s or PhD stream |
| Evidence | opportunities → research_reports → research_findings ↔ research_sources through finding_sources |
| Source provenance | original and canonical URLs, publication/retrieval timestamps, verification state and optional content hash |
| Execution evidence | agent_executions ↔ research_sources through execution_sources |
| Deadlines and requirements | opportunities → deadlines / application_requirements; source links retained |
| Immigration | separate `with_spouse` and `solo_then_spouse` assessment history per opportunity, nationality, review date, report link |
| Documents / applications | opportunities → documents; one application record per opportunity |
| Outreach | professors → verified contacts / email_conversations → email_messages |
| Agents | opportunities → agent_tasks → agent_executions → execution_logs |
| Approvals | immutable-to-client approval payload/hash/status plus one external_actions record per approval |
| Audit | append-only-to-client audit_events; no record contents in log metadata |

Unresearched immigration eligibility is `unknown`, never inferred as ineligible. Neither scenario filters out the other. The UI presently communicates this policy; assessment authoring comes later.

Source snapshots deduplicate by owner + canonical URL + retrieval timestamp. Opportunities deduplicate by owner + canonical URL; title alone is not an identity. URL normalization strips fragments and tracking parameters, retains functional query parameters, and sorts them. Different intakes sharing one URL will need a future programme/intake identity before importing recurring cohorts. Source URL equivalence is not evidence equivalence.

## Durable work and approvals

Phase 1 supports validated enqueue and queue reads. Task kinds are closed enums that exclude sending/submission/payment. Task/execution tables reserve attempts, leases, fencing token, timestamps, structured input/output and evidence. `JobRepository` and `ResearchAdapter` define the future worker boundary; **no claiming or executing worker exists yet**.

Future workers must claim atomically with `FOR UPDATE SKIP LOCKED`, bounded retries, expiring leases, and fencing-token checks. Complete result persistence and task completion must be one transaction. Do not deploy a naïve process-local queue or call a model directly from a button.

Approval and external-action tables are deliberately read-only to authenticated users until a narrow approval RPC and executor are implemented. A future approval must bind exact recipient, subject, body, attachment digests, action and destination to a payload hash and expiry. Editing invalidates approval. Atomically consume once; retain an idempotency key. Ambiguous provider timeouts require reconciliation (`uncertain`), not blind resend. Research agents must never receive sending tools.

## Security limits and future work

- No arbitrary URL-fetch endpoint or external-action endpoint exists. A stored URL is a navigation link, not fetch authorization.
- Future fetchers need outbound allowlists, DNS/IP validation, private/link-local/metadata denial, redirect revalidation or disabled redirects, size/time limits and an egress boundary against DNS rebinding.
- Treat web pages, PDFs, LinkedIn posts and imported findings as untrusted data. Never execute source instructions, inject them as system instructions, or allow source text to choose tools/recipients/credentials. Model results must pass runtime validation and remain unverified until independent review.
- Login uses Supabase Auth's protections; configure its rate limits and monitoring. No claim of production abuse/load testing is made.
- Private storage bucket and read policy are supplied. Upload policies are intentionally absent until MIME/content validation, malware scanning, metadata auditing, retention and authorized download flows exist.
- Supabase administrators/service roles bypass RLS. Keep those credentials outside this web app; a future worker should use narrowly scoped RPCs.
- This is not a completed security audit. Live GoTrue, PostgREST, Storage and deployment behavior require the setup checklist.

## Phased continuation

1. Provision and validate this foundation, including owner and negative-access tests.
2. Expand CRUD to institutions/professors/funding, deadlines, evidence, scenario assessments, application pipeline and saved views.
3. Implement leased worker RPCs and one official-source verification action, with transactional research results and evidence.
4. Add private documents, preparation workflows, approved Gmail send and reply ingestion.
5. Add idempotent recurring discovery, deadline checks and notifications.
6. Harden with live-service browser tests, abuse tests, CSP refinement, observability, backups and restore exercises.

## Implementation references

- Installed Next.js 16.4.0 guides: `node_modules/next/dist/docs/01-app/02-guides/authentication.md`, `server-actions.md`, and `../03-api-reference/04-functions/cookies.md`.
- [Supabase SSR client guidance](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase server-verified user lookup](https://supabase.com/docs/reference/javascript/auth-getuser)
- [Supabase SSR cache and cookie considerations](https://supabase.com/docs/guides/auth/server-side/advanced-guide)
