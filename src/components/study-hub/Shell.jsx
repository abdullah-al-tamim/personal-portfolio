import Link from "next/link";
import { signOut } from "@/app/study-hub/actions";
export function Badge({ children }) {
  return <span className="hub-badge">{children}</span>;
}
export function Empty({ title, children }) {
  return (
    <div className="hub-empty">
      <span aria-hidden="true">+</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function Header({ eyebrow, title, children }) {
  return (
    <header className="hub-page-header">
      <p className="hub-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="hub-muted">{children}</p>}
    </header>
  );
}
export default function Shell({ children }) {
  return (
    <div className="hub-shell">
      <aside className="hub-sidebar">
        <Link href="/study-hub" className="hub-brand">
          <span>SH</span>Study Hub
        </Link>
        <p className="hub-eyebrow">PRIVATE WORKSPACE</p>
        <nav aria-label="Study Hub">
          <Link href="/study-hub">
            Overview <span>↗</span>
          </Link>
          <Link href="/study-hub/opportunities">All opportunities</Link>
          <Link href="/study-hub/opportunities?kind=masters">
            Master’s programmes
          </Link>
          <Link href="/study-hub/opportunities?kind=phd">PhD positions</Link>
          <Link href="/study-hub/tasks">Research queue</Link>
          <Link href="/study-hub/documents">Documents &amp; attestation</Link>
          <Link href="/study-hub/settings">Settings & integrations</Link>
        </nav>
        <div className="hub-sidebar-foot">
          <Badge>Owner access only</Badge>
          <p>
            Evidence first.
            <br />
            One next step at a time.
          </p>
          <form action={signOut}>
            <button>Sign out ↗</button>
          </form>
          <Link href="/">Back to portfolio</Link>
        </div>
      </aside>
      <main className="hub-main">
        <div className="hub-topbar">
          <span>Higher study / Command center</span>
          <Badge>Foundation · Phase 1</Badge>
          <form className="hub-mobile-signout" action={signOut}>
            <button>Sign out</button>
          </form>
        </div>
        {children}
      </main>
    </div>
  );
}
