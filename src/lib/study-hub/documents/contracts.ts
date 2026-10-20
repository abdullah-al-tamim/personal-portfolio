export type DocumentSubject = 'self' | 'spouse' | 'sponsor';
export type RequirementStrength = 'mandatory' | 'conditional' | 'optional' | 'not_required' | 'unverified';
export type DocumentJobStatus = 'queued' | 'running' | 'waiting_approval' | 'waiting_manual' | 'completed' | 'failed' | 'paused' | 'cancelled';
export interface DocumentProcessingPlan {
 schema_version: '1.0'; engine: 'deterministic-readiness-v1'; scope: string;
 document_revision: number; destination: string; official_process_url: string;
 checks: string[]; blockers: string[]; external_submission_performed: false;
}
/** Future adapter boundary: no implicit permission to transmit private files. */
export interface AuthorizedDocumentInput {
 documentId: string; versionId: string; sha256: string;
 approvalId: string; approvedEndpoint: string; approvedPurpose: string;
}
export interface DocumentAnalysisAdapter {
 analyze(input: AuthorizedDocumentInput, signal: AbortSignal): Promise<{
  findings: { claim: string; sourceUrls: string[]; confidence: 'unverified' }[];
 }>;
}
