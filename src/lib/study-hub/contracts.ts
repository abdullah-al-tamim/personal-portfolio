/** Contracts only: no model, email or ChatGPT Work API is assumed to exist. */
export type UUID = string;
export type Verification = "unverified" | "verified" | "stale" | "conflicting";
export type AgentKind =
  | "discovery"
  | "verification"
  | "professor_research"
  | "eligibility"
  | "funding"
  | "immigration"
  | "application_preparation"
  | "outreach_draft"
  | "deadline_monitor";
export interface OwnedRecord {
  id: UUID;
  owner_id: UUID;
  created_at: string;
  updated_at: string;
}
export interface Opportunity extends OwnedRecord {
  programme_id: UUID | null;
  professor_id: UUID | null;
  recruitment_post_id: UUID | null;
  title: string;
  kind: "masters" | "phd";
  country: string;
  official_url: string;
  canonical_url: string;
  funding: "unknown" | "full" | "partial" | "none";
  status:
    | "discovered"
    | "bookmarked"
    | "shortlisted"
    | "preparing"
    | "submitted"
    | "rejected";
  verification_status: Verification;
  notes: string;
}
export interface Source extends OwnedRecord {
  original_url: string;
  canonical_url: string;
  title: string;
  published_at: string | null;
  retrieved_at: string;
  verification_status: Verification;
  content_sha256: string | null;
}
export interface AgentTask extends OwnedRecord {
  opportunity_id: UUID;
  kind: AgentKind;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  inputs: Record<string, unknown>;
  idempotency_key: UUID;
  attempts: number;
  max_attempts: number;
  available_at: string;
  lease_until: string | null;
  lease_token: UUID | null;
}
export interface AgentExecution extends OwnedRecord {
  task_id: UUID;
  attempt: number;
  status: "running" | "succeeded" | "failed";
  started_at: string;
  finished_at: string | null;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown> | null;
  error_code: string | null;
  model: string | null;
  provider: string | null;
}
export interface Evidence {
  url: string;
  title: string;
  published_at: string | null;
  retrieved_at: string;
  excerpt: string;
}
export interface ResearchResult {
  schema_version: "1.0";
  summary: string;
  findings: Array<{
    claim: string;
    source_indexes: number[];
    verification: "unverified";
  }>;
  sources: Evidence[];
}
export interface ResearchAdapter {
  readonly name: string;
  run(
    task: Readonly<AgentTask>,
    context: {
      signal: AbortSignal;
      runId: UUID;
      log: (code: string) => Promise<void>;
    },
  ): Promise<ResearchResult>;
}
export interface JobRepository {
  // Future SQL RPC implementation: SKIP LOCKED + expiring lease + fencing token.
  claim(
    workerId: string,
  ): Promise<{
    task: AgentTask;
    execution: AgentExecution;
    leaseToken: UUID;
  } | null>;
  complete(
    taskId: UUID,
    leaseToken: UUID,
    result: ResearchResult,
  ): Promise<void>;
  fail(
    taskId: UUID,
    leaseToken: UUID,
    errorCode: string,
    retryAt: string | null,
  ): Promise<void>;
}
export interface ExternalActionApproval extends OwnedRecord {
  action_type:
    | "send_email"
    | "submit_application"
    | "upload_document"
    | "payment"
    | "sign_declaration"
    | "accept_terms";
  payload: Record<string, unknown>;
  payload_sha256: string;
  status: "pending" | "approved" | "rejected" | "consumed" | "expired";
  decided_at: string | null;
  expires_at: string;
  consumed_at: string | null;
}
// Do not provide send() on a research adapter. A future execution service must
// atomically consume a non-expired approval for the exact reviewed payload hash.
export interface ApprovedEmailTransport {
  execute(
    approvalId: UUID,
    payloadHash: string,
    idempotencyKey: UUID,
  ): Promise<{ providerMessageId: string }>;
}
