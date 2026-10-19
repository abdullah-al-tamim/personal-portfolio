import Link from "next/link";
import { isConfigured } from "@/lib/study-hub/server";
import { LoginForm } from "@/components/study-hub/Forms";
export default function Login() {
  return (
    <main className="hub-login">
      <section className="hub-login-intro">
        <p className="hub-eyebrow">STUDY HUB / PRIVATE ACCESS</p>
        <h1>
          Your next chapter,
          <br />
          <em>thoughtfully planned.</em>
        </h1>
        <p>
          A dedicated workspace for funded graduate opportunities, evidence, and
          the decisions ahead.
        </p>
        <div className="hub-login-lines">
          <span>01 / Discover possibilities</span>
          <span>02 / Verify the details</span>
          <span>03 / Pursue with purpose</span>
        </div>
      </section>
      <section className="hub-login-card">
        <span className="hub-brand-mark">SH</span>
        <h2>Welcome to your workspace</h2>
        <p className="hub-muted">Access is limited to the approved owner.</p>
        {isConfigured() ? (
          <LoginForm />
        ) : (
          <div className="hub-notice">
            <h3>Setup required</h3>
            <p>
              Authentication and database configuration are not connected. No
              private data is available.
            </p>
            <p>
              Follow the repository’s Study Hub setup guide to enable access.
            </p>
          </div>
        )}
        <Link href="/">← Return to portfolio</Link>
      </section>
    </main>
  );
}
