# Document Readiness Center — reviewable foundation

## Audit and scope

Based on main d0ad72d19d5eb3985985ad8ace2075ea762ea5b5 (merged Study Hub foundation). Existing Next 16.4 / React 19.3 / Supabase session + owner allowlist are preserved. Public portfolio and research tables are not replaced. The original study_documents table becomes the immutable version metadata store. The original research queue remains separate and has no worker.

This PR is a functional first slice, **not completion of the full document-agent specification**. It does not claim AI, government, bank, university or Europass integrations are live.

## Implemented

- Authenticated document inventory, search, owner filtering, details and acquisition board.
- Independent acquisition, digital, attestation, translation and readiness states; revisions and transition history.
- Private PDF/PNG/JPEG uploads up to 3 MB; bounded request parsing, magic-byte checks, SHA256 deduplication, immutable object paths and numbered versions.
- Authenticated preview/download proxy with no-store, nosniff and sandbox CSP. No public storage URLs or service-role key.
- Per-opportunity requirement links, stage, source evidence, confirmation and freshness limits. Readiness counts only source-confirmed mandatory items, valid dates and linked ready documents. Institutional acceptance is never inferred.
- Same-owner prerequisite graph with cycle rejection.
- Transactional ready-status trigger creates a unique durable job. The server action invokes the real database processor after the enqueue transaction commits. Recovery button processes queued jobs after an interrupted request.
- Internal rules-based plans, attempts, errors, execution records, immutable plan review snapshot, expiry and revision checks. Approval resumes to waiting_manual; it cannot submit externally.
- Pause, cancel and bounded requeue; private JSON export (metadata only; maximum 1000 rows per table).
- Generic 36-document initialization with unknown statuses, never a public personal seed.
- Source-linked attestation, EWU acquisition and Europass guidance; conditional visa/financial inventory views and due-date attention counts.

## Migration and local setup

Apply migrations in filename order to a dedicated test Supabase project first. New migration: 202610200002_document_center.sql. It is additive except for updating the existing private bucket to PDF/PNG/JPEG and a 3 MB limit. The older phase-1 bucket allowed DOCX/TXT but uploads were disabled. Review compatibility before production rollout.

Existing server-only variables remain sufficient: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY and STUDY_HUB_OWNER_ID. Configure the same private approved_users row as the base app. Never commit values. No model key is requested because no model adapter is implemented.

Run npm ci, npm test, npm run lint, npm run typecheck:contracts, npm run build, then npm run dev. Open /study-hub/documents after signing in. Initialize the checklist and supply real possession states privately. No production private records are seeded by this migration.

The CLI migration generator could not be installed because network approval was cancelled. The SQL file was authored directly and is exercised against PostgreSQL-compatible PGlite in tests. Deployment remains an explicit reviewed step; this PR does not apply itself to production.

## Security and execution limits

Owner-only RLS, same-owner composite FKs, explicit RPC authorization, schema-qualified security-definer code, restricted EXECUTE grants, metadata-only audit events, revision checks and row locks protect the implemented surface. No arbitrary fetch endpoint exists. Source text cannot issue commands. Session uploads remain private and cannot overwrite existing objects. Signature checking is not antivirus scanning, OCR, legal authenticity verification or full file parsing. Treat untrusted files cautiously.

Storage writes and metadata registration are separate transactions. If registration fails after upload, the UI reports a private orphan requiring administrative reconciliation; no unsafe overwrite or automatic destructive cleanup occurs. Direct owner Storage API uploads do not pass the web route's signature checks and must not be treated as trusted merely because they exist.

The internal processor uses one short database transaction, not a long-running remote worker. Crashes roll back the claim and result together. Failed runs are retryable up to three attempts with a delay. No scheduler exists to drain jobs while the owner is offline; the ready action executes automatically and the recovery button drains leftovers. Leases are reserved for future distributed workers. No external submission is ever retried because none is implemented.

## Unfinished capabilities

- Actual model-backed readiness research/OCR, authorized processing endpoints and private-content consent.
- Autonomous scheduled discovery/status polling/notifications; automatically advancing dependent steps.
- Government/browser adapters, external payload-bound approval/consumption, submission receipts and reconciliation.
- Derivative image compression, scan readability detection, page completeness and malware scanning.
- Manual evidence-backed recording of completed external attestations, translations and tracking numbers.
- Verified destination-specific apostille recognition, board-specific HSC workflow, EWU collection fees/forms and current MOI procedures.
- CV generation and official Europass import/export integration.
- Full registry fields (fees, process duration, authority metadata), requirement editing/removal, secure permanent deletion and complete file archive export.
- Detailed UI for every run/audit record and complete acquisition-board columns.

Do not use internal plan approval as consent to transmit identity documents. A future executor must bind action, destination, exact payload, version digest and expiry and enforce one-time consumption with ambiguous outcomes held for reconciliation.

## Validation and release checklist

Automated tests cover schema application, owner isolation, unauthorized RPC rejection, file registration prerequisite, deduplication, status-triggered enqueue, actual processing, review/replay rejection, external-status denial and basic MIME/readiness logic. Existing tests continue to run. Live Supabase Storage, authenticated browser uploads, mobile visual QA, rollback/restore and production monitoring still require verification before calling this production-ready.

Preview should use a dedicated migrated Supabase environment. Keep this PR draft until live upload/download + negative-access checks and document status workflows pass. No real government submission should be used as a test.
