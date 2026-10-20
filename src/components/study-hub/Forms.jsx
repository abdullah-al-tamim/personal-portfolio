"use client";
import { useActionState } from "react";
import {
  signIn,
  createOpportunity,
  changeStatus,
  queueResearch,
} from "@/app/study-hub/actions";
import { statuses, agentKinds } from "@/lib/study-hub/validation.mjs";
export function ActionForm({ action, children, label, className = "" }) {
  const [state, submit, pending] = useActionState(action, {});
  return (
    <form action={submit} className={className}>
      {children}
      <button className="hub-button" disabled={pending}>
        {pending ? "Saving…" : label}
      </button>
      <div aria-live="polite">
        {state.error && (
          <p className="hub-error" role="alert">
            {state.error}
          </p>
        )}
        {state.success && <p className="hub-success">{state.success}</p>}
      </div>
    </form>
  );
}
export function LoginForm() {
  return (
    <ActionForm
      action={signIn}
      label="Enter your workspace"
      className="hub-form"
    >
      <label>
        Email
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={256}
          required
        />
      </label>
    </ActionForm>
  );
}
export function OpportunityForm() {
  return (
    <ActionForm
      action={createOpportunity}
      label="Save opportunity"
      className="hub-form"
    >
      <label>
        Programme or position
        <input
          name="title"
          minLength={3}
          maxLength={200}
          required
          placeholder="e.g. MSc in Computer Science"
        />
      </label>
      <div className="hub-grid-two">
        <label>
          Research stream
          <select name="kind">
            <option value="masters">Master’s</option>
            <option value="phd">PhD</option>
          </select>
        </label>
        <label>
          Country
          <input name="country" minLength={2} maxLength={80} required />
        </label>
      </div>
      <label>
        Official source URL
        <input
          name="official_url"
          type="url"
          maxLength={2048}
          required
          placeholder="https://university.edu/programme"
        />
      </label>
      <label>
        Reported funding
        <select name="funding">
          <option value="unknown">Not yet verified</option>
          <option value="full">Full funding reported</option>
          <option value="partial">Partial funding reported</option>
          <option value="none">No funding reported</option>
        </select>
      </label>
      <label>
        Private notes
        <textarea name="notes" maxLength={5000} rows={4} />
      </label>
      <p className="hub-muted">
        New records remain unverified until checked against evidence.
      </p>
    </ActionForm>
  );
}
export function StatusForm({ opportunity }) {
  return (
    <ActionForm action={changeStatus} label="Save status" className="hub-form">
      <input type="hidden" name="id" value={opportunity.id} />
      <label>
        Application stage
        <select name="status" defaultValue={opportunity.status}>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>
    </ActionForm>
  );
}
export function TaskForm({ id, requestId }) {
  return (
    <ActionForm
      action={queueResearch}
      label="Queue research request"
      className="hub-form"
    >
      <input type="hidden" name="opportunity_id" value={id} />
      <input type="hidden" name="idempotency_key" value={requestId} />
      <label>
        Research action
        <select name="kind">
          {agentKinds.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>
      <p className="hub-muted">
        Requests persist in the database. No AI worker is connected yet.
      </p>
    </ActionForm>
  );
}
