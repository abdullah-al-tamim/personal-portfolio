import test from "node:test";
import assert from "node:assert/strict";
import {
  opportunityInput,
  taskInput,
  canonicalSource,
  sourceUrl,
  researchImport,
  isApprovedIdentity,
} from "../src/lib/study-hub/validation.mjs";
const input = {
  title: "Example programme",
  kind: "masters",
  country: "Example country",
  official_url: "https://example.edu/admissions",
  funding: "unknown",
  notes: "",
};
test("owner access fails closed and requires an exact confirmed identity", () => {
  assert.equal(isApprovedIdentity(null, "a"), false);
  assert.equal(
    isApprovedIdentity({ id: "a", email_confirmed_at: "date" }, undefined),
    false,
  );
  assert.equal(
    isApprovedIdentity({ id: "b", email_confirmed_at: "date" }, "a"),
    false,
  );
  assert.equal(isApprovedIdentity({ id: "a" }, "a"), false);
  assert.equal(
    isApprovedIdentity({ id: "a", email_confirmed_at: "date" }, "a"),
    true,
  );
});
test("opportunity validation strips forged owner, status, verification fields", () => {
  const parsed = opportunityInput.parse({
    ...input,
    owner_id: "attacker",
    verification_status: "verified",
    status: "submitted",
  });
  assert.deepEqual(parsed, input);
  assert.equal(
    opportunityInput.safeParse({ ...input, title: "x" }).success,
    false,
  );
  assert.equal(
    opportunityInput.safeParse({ ...input, notes: "x".repeat(5001) }).success,
    false,
  );
});
test("URL storage rejects unsafe schemes, credentials, IPs and local hosts", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://example.edu",
    "https://user:pass@example.edu",
    "https://127.0.0.1",
    "https://[::1]",
    "https://localhost",
    "https://service.internal",
    "https://example.edu:8443",
  ])
    assert.equal(sourceUrl.safeParse(url).success, false, url);
  assert.equal(
    canonicalSource("https://Example.edu/apply?b=2&utm_source=mail&a=1#top"),
    "https://example.edu/apply?a=1&b=2",
  );
  assert.equal(
    canonicalSource("https://example.edu/apply?programme=2"),
    "https://example.edu/apply?programme=2",
  );
});
test("research queue cannot enqueue external sends and requires UUID idempotency keys", () => {
  const task = {
    opportunity_id: "00000000-0000-4000-8000-000000000001",
    idempotency_key: "00000000-0000-4000-8000-000000000002",
    kind: "verification",
  };
  assert.equal(taskInput.safeParse(task).success, true);
  assert.equal(
    taskInput.safeParse({ ...task, kind: "send_email" }).success,
    false,
  );
  assert.equal(
    taskInput.safeParse({ ...task, idempotency_key: "x" }).success,
    false,
  );
});
test("import requires evidence and cannot claim verified results", () => {
  const payload = {
    schema_version: "1.0",
    external_id: "test",
    opportunity: input,
    findings: [
      { claim: "Claim", source_indexes: [0], verification: "unverified" },
    ],
    sources: [
      {
        url: input.official_url,
        title: "Source",
        published_at: null,
        retrieved_at: "2026-10-19T00:00:00Z",
        excerpt: "Evidence",
      },
    ],
  };
  assert.equal(researchImport.safeParse(payload).success, true);
  assert.equal(
    researchImport.safeParse({ ...payload, sources: [] }).success,
    false,
  );
  assert.equal(
    researchImport.safeParse({
      ...payload,
      findings: [{ ...payload.findings[0], source_indexes: [1] }],
    }).success,
    false,
  );
  assert.equal(
    researchImport.safeParse({
      ...payload,
      findings: [{ ...payload.findings[0], verification: "verified" }],
    }).success,
    false,
  );
});
