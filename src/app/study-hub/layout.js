import "./study-hub.css";
export const metadata = {
  title: "Study Hub | Private workspace",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};
export const dynamic = "force-dynamic";
export default function StudyLayout({ children }) {
  return <div className="study-hub">{children}</div>;
}
