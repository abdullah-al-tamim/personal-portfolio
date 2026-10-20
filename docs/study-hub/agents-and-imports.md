# Agent, import and approval contracts

Runtime validation: `src/lib/study-hub/validation.mjs`. TypeScript domain/adapter contracts: `src/lib/study-hub/contracts.ts`. Portable JSON Schema: `research-import.schema.json`. The runtime validator additionally enforces URL and source-index semantics that JSON Schema alone does not express.

## Import format, version 1.0

The following is synthetic example data, not an actual opportunity or funding claim:

```json
{
  "schema_version": "1.0",
  "external_id": "research-session/example-001",
  "opportunity": {
    "title": "Example graduate programme",
    "kind": "masters",
    "country": "Example country",
    "official_url": "https://example.edu/programme",
    "funding": "unknown",
    "notes": "Review before pursuing."
  },
  "findings": [{
    "claim": "Example claim requiring review.",
    "source_indexes": [0],
    "verification": "unverified"
  }],
  "sources": [{
    "url": "https://example.edu/programme",
    "title": "Example official programme page",
    "published_at": null,
    "retrieved_at": "2026-10-19T00:00:00Z",
    "excerpt": "A short relevant supporting excerpt."
  }]
}
```

Ask ChatGPT Work or another research agent to produce this JSON using only retrieved evidence. Unknown publication dates stay null. A retrieval date means the source was actually retrieved at that time, not when JSON was drafted. A finding must cite at least one existing source index. Do not include documents, passport numbers, credentials, emails or private applicant profiles in a public export.

**The importer/exporter UI and persistence transaction are not implemented in Phase 1.** This is a versioned interoperability contract, not an upload endpoint. To implement import:

1. Accept a bounded file only behind `requireOwner()` and validate with `researchImport`.
2. Calculate canonical opportunity identity; show the owner an insert/update/conflict preview. Store import external IDs in a dedicated provenance table with an owner-scoped unique key before enabling repeated imports.
3. Reuse existing opportunity identity; preserve source snapshots and conflicting claims. Do not overwrite a previously verified fact with a later unverified import.
4. Insert sources, report, findings and finding-source links atomically. Force imported claims to `unverified`; model assertions are not verification.
5. Enqueue independent official-source verification. Source text must never authorize fetching arbitrary destinations or external communications.
6. Export only an explicit allowlist of sanitized public fields, after showing the exact export. Keep private exports outside the public repository.

## Agent contracts

Each future worker run needs a UUID, task/attempt number, status, start/finish timestamps, provider/model, validated inputs/outputs, source links and redacted execution logs. Record failures with stable error codes. Use AbortSignal and bounded task deadlines.

| Agent kind | Expected output |
| --- | --- |
| discovery | Candidate opportunities with provenance; recurring/global discovery needs a future scope field because Phase 1 tasks require an opportunity |
| verification | Source-backed deadline, eligibility, funding and open/closed findings |
| professor_research | Institutional identity, research themes, recent publications and fit evidence |
| eligibility | Verified-profile comparison and explicitly unknown prerequisites |
| funding | Itemized coverage, currency, estimates and uncovered costs |
| immigration | Separate accompanied and solo-first reports, nationality, official sources and review dates |
| application_preparation | Draft/checklist with factual claims tied to verified profile and programme evidence |
| outreach_draft | Draft only; recipient must come from a verified institutional contact |
| deadline_monitor | Rechecked dates with original timezone/text, change history and source snapshots |

No adapter is bound to a model in this release. The existing Next.js stack is retained; a future Eve or other durable worker can implement `JobRepository` and `ResearchAdapter` without changing button semantics. There is no invented ChatGPT Work/Codex execution API.

Retry contract: at most `max_attempts` (default 3, upper bound 5), exponential backoff with jitter, lease expiry/reclaim, fenced updates and cancellation checks. Authentication/configuration/validation failures are terminal. Respect provider Retry-After for throttling. Never apply the research retry policy blindly to external sends.

## Approval executor: future implementation boundary

The database supplies restricted approval/history tables; this release cannot issue approvals or execute actions. Implement a separate server-only service before connecting Gmail:

- Start with the minimum sending scope; request reply-read scopes only when correspondence tracking is implemented.
- Store encrypted provider tokens in server-side secret storage. Never browser bundles, database tables readable by the session, Git or logs.
- Verify recipient against institutional evidence, prepare exact content, attachments and destination, then show the owner a review screen.
- Bind approval to a canonical payload hash, a short expiry and an explicit authenticated decision. Audit both approval and execution.
- Consume once using a transactional RPC. A text edit or recipient/attachment change requires a new approval.
- Record pending/executing/succeeded/failed/uncertain and provider message/thread IDs. On ambiguous timeout, reconcile before permitting another send.
- Final applications, payments, declarations, terms acceptance and sensitive uploads require their own reviewed payloads. An email approval grants none of these permissions.
