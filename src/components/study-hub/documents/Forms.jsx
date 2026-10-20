"use client";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  states,
  label,
  documentTypes,
} from "@/lib/study-hub/documents/catalog.mjs";
import {
  createDocument,
  transitionDocument,
  saveMetadata,
  linkRequirement,
  addDependency,
  jobAction,
  reviewPlan,
} from "@/app/study-hub/documents/actions";
export function ActionForm({ action, children, className = "hub-form" }) {
  const [state, submit, pending] = useActionState(action, {});
  return (
    <form action={submit} className={className}>
      <fieldset disabled={pending}>{children}</fieldset>
      {pending && <p role="status">Saving…</p>}
      {state.error && (
        <p role="alert" className="doc-error">
          {state.error}
        </p>
      )}
      {state.success && <p role="status">{state.success}</p>}
    </form>
  );
}
export function CreateForm() {
  return (
    <ActionForm action={createDocument}>
      <label>
        Title
        <input name="title" required maxLength={160} />
      </label>
      <label>
        Document type
        <select name="type_key">
          {documentTypes.map((t) => (
            <option key={t.key} value={t.key}>
              {t.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Belongs to
        <select name="subject">
          <option value="self">Me</option>
          <option value="spouse">Spouse</option>
          <option value="sponsor">Sponsor</option>
        </select>
      </label>
      <input type="hidden" name="category" value="Other" />
      <button className="hub-button">Add document</button>
    </ActionForm>
  );
}
export function StatusForms({ doc }) {
  return (
    <div className="doc-status-grid">
      {Object.entries(states).map(([axis, values]) => (
        <ActionForm key={axis} action={transitionDocument}>
          <input type="hidden" name="id" value={doc.id} />
          <input type="hidden" name="revision" value={doc.revision} />
          <input type="hidden" name="axis" value={axis} />
          <label>
            {label(axis)}
            <select
              name="target"
              defaultValue={doc[axis]}
              key={`${axis}-${doc.revision}`}
            >
              {values
                .filter(
                  (v) =>
                    axis !== "attestation" ||
                    ![
                      "preparing",
                      "awaiting_approval",
                      "approved",
                      "submitted",
                      "processing",
                      "completed",
                    ].includes(v),
                )
                .map((v) => (
                  <option key={v} value={v}>
                    {label(v)}
                  </option>
                ))}
            </select>
          </label>
          <button className="hub-button hub-button-secondary">
            Save {label(axis)}
          </button>
        </ActionForm>
      ))}
    </div>
  );
}
export function MetadataForm({ doc }) {
  return (
    <ActionForm action={saveMetadata}>
      <input type="hidden" name="id" value={doc.id} />
      {[
        ["issuer", "Issuing institution"],
        ["destination", "Destination / institution"],
        ["process_url", "Official process URL"],
        ["next_action", "Next action"],
      ].map(([key, title]) => (
        <label key={key}>
          {title}
          <input
            name={key}
            defaultValue={doc[key]}
            type={key === "process_url" ? "url" : "text"}
            maxLength={key === "next_action" ? 500 : 300}
          />
        </label>
      ))}
      <div className="doc-status-grid">
        {[
          ["issue_date", "Issued"],
          ["expiry_date", "Expires"],
          ["due_date", "Action due"],
        ].map(([key, title]) => (
          <label key={key}>
            {title}
            <input type="date" name={key} defaultValue={doc[key] || ""} />
          </label>
        ))}
      </div>
      <label>
        Private notes
        <textarea name="notes" defaultValue={doc.notes} maxLength={4000} />
      </label>
      <button className="hub-button">Save details</button>
    </ActionForm>
  );
}
export function UploadForm({ id }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function upload(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("Uploading privately…");
    try {
      const response = await fetch("/study-hub/documents/upload", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const data = await response.json();
      setMessage(data.error || data.success);
      if (response.ok) router.refresh();
    } catch {
      setMessage(
        "Upload interrupted. Refresh to check saved versions before retrying.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={upload} className="doc-upload">
      <input type="hidden" name="id" value={id} />
      <label>
        Choose or drop a PDF, PNG or JPEG
        <input
          aria-label="Private document file"
          name="file"
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          required
          disabled={busy}
        />
      </label>
      <p className="hub-muted">
        Up to 3 MB. Originals are immutable. No files are sent to AI services.
        Signature checks are not malware or authenticity certification.
      </p>
      <button disabled={busy} className="hub-button">
        Upload private version
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
export function RequirementForm({ id, opportunities }) {
  return (
    <ActionForm action={linkRequirement}>
      <input type="hidden" name="id" value={id} />
      <label>
        Opportunity
        <select required name="opportunity_id">
          {opportunities.map((o) => (
            <option key={o.id} value={o.id}>
              {o.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Requirement description
        <input name="label" required maxLength={300} />
      </label>
      <label>
        Stage
        <select name="stage">
          {[
            "application",
            "scholarship",
            "conditional_admission",
            "admission",
            "visa",
            "enrolment",
            "dependent_visa",
          ].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <label>
        Requirement strength
        <select name="classification">
          {[
            "unverified",
            "mandatory",
            "conditional",
            "optional",
            "not_required",
          ].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <label>
        Official evidence URL
        <input type="url" name="source_url" />
      </label>
      <label>
        Maximum document age in days, if published
        <input type="number" min={1} max={3650} name="freshness_days" />
      </label>
      <label className="doc-check">
        <input type="checkbox" name="verified" />I checked this requirement
        against the official source
      </label>
      <button className="hub-button">Link requirement</button>
    </ActionForm>
  );
}
export function DependencyForm({ id, documents }) {
  return (
    <ActionForm action={addDependency}>
      <input type="hidden" name="id" value={id} />
      <label>
        Must be ready first
        <select name="prerequisite_id">
          {documents
            .filter((d) => d.id !== id)
            .map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
        </select>
      </label>
      <button className="hub-button hub-button-secondary">
        Add prerequisite
      </button>
    </ActionForm>
  );
}
export function JobControls({ job }) {
  return (
    <ActionForm action={jobAction}>
      <input type="hidden" name="id" value={job.id} />
      <div className="doc-actions">
        {job.status === "queued" && (
          <button name="target" value="paused">
            Pause
          </button>
        )}
        {["paused", "failed"].includes(job.status) && job.attempts < 3 && (
          <button name="target" value="queued">
            Requeue
          </button>
        )}
        {!["completed", "cancelled"].includes(job.status) && (
          <button name="target" value="cancelled">
            Cancel
          </button>
        )}
      </div>
    </ActionForm>
  );
}
export function ReviewForm({ review }) {
  return (
    <ActionForm action={reviewPlan}>
      <input type="hidden" name="id" value={review.id} />
      <p className="hub-muted">
        Approval acknowledges this internal plan only. It does not authorize an
        external upload, email, payment or submission.
      </p>
      <div className="doc-actions">
        <button name="decision" value="approved" className="hub-button">
          Approve plan
        </button>
        <button
          name="decision"
          value="rejected"
          className="hub-button hub-button-secondary"
        >
          Reject
        </button>
      </div>
    </ActionForm>
  );
}
