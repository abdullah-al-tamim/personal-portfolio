import test from "node:test";
import assert from "node:assert/strict";
import { emailFailure, sendContact, validateMessage } from "../src/lib/contact.mjs";
const valid = {
  user_name: "Portfolio test",
  user_email: "tester@example.com",
  subject: "Test subject",
  message: "A test message.",
  website: "",
};
const config = {
  serviceId: "test-service",
  templateId: "test-template",
  publicKey: "test-public-key",
};
test("uses original EmailJS template fields and reply address", async () => {
  let request;
  await sendContact(valid, config, async (url, options) => {
    request = { url, ...options };
    return { ok: true, status: 200 };
  });
  assert.equal(request.url, "https://api.emailjs.com/api/v1.0/email/send");
  assert.equal(request.method, "POST");
  const body = JSON.parse(request.body);
  assert.equal(body.template_params.subject, valid.subject);
  assert.equal(body.template_params.user_name, valid.user_name);
  assert.equal(body.template_params.reply_to, valid.user_email);
  assert.equal(body.template_params.website, undefined);
  assert.equal(body.accessToken, undefined);
});
test("invalid, empty, oversized and bot submissions do not reach transport", async () => {
  let calls = 0;
  for (const change of [
    { user_email: "not-an-email" },
    { subject: "   " },
    { message: "x".repeat(5001) },
    { website: "spam" },
  ]) {
    await assert.rejects(
      sendContact({ ...valid, ...change }, config, async () => {
        calls++;
        return { ok: true };
      }),
    );
  }
  assert.equal(calls, 0);
  assert.equal(
    validateMessage({ ...valid, user_name: "  Tamim  " }).user_name,
    "Tamim",
  );
});
test("missing configuration cannot report success or send", async () => {
  await assert.rejects(
    sendContact(valid, {}, async () => {
      assert.fail("must not send");
    }),
    /temporarily unavailable/,
  );
});
test("provider failures, throttling and connection failures surface honest status", async () => {
  await assert.rejects(
    sendContact(valid, config, async () => ({ ok: false, status: 403 })),
    /EmailJS 403/,
  );
  await assert.rejects(
    sendContact(valid, config, async () => ({ ok: false, status: 429 })),
    /wait a minute/,
  );
  await assert.rejects(
    sendContact(valid, config, async () => {
      throw new TypeError("Network failed");
    }),
    /could not be confirmed/,
  );
  await assert.rejects(
    sendContact(valid, config, async () => {
      throw new DOMException("Timed out", "AbortError");
    }),
    /could not be confirmed/,
  );
});


test("provider diagnostics are actionable without disclosing raw responses", () => {
  assert.match(emailFailure(400, "Gmail_API: invalid_grant"), /reconnected/);
  assert.match(emailFailure(403, "Origin not allowed"), /website address/);
  assert.match(emailFailure(400, "template not found"), /template/);
  assert.doesNotMatch(emailFailure(400, "secret-service-123"), /secret-service-123/);
});

