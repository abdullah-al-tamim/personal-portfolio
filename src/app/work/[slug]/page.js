import Link from "next/link";
import { notFound } from "next/navigation";
import { studies } from "@/assets/studies";
const titles = {
  reconciliation: "EHR Report Extraction & Encounter Reconciliation",
  architecture: "Parallel Workflows & Retool Performance",
  intelligence: "Import-Error Resolution with Patient History",
};
export const dynamicParams = false;
export function generateStaticParams() {
  return studies.map((s) => ({ slug: s.id }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = studies.find((s) => s.id === slug);
  if (!study) return {};
  const title = titles[slug] + " | Abdullah Al Tamim";
  return {
    title,
    description: study.intro,
    alternates: { canonical: "/work/" + slug },
    openGraph: {
      title,
      description: study.intro,
      url: "/work/" + slug,
      type: "article",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: study.intro,
      images: ["/opengraph-image"],
    },
  };
}
export default async function CaseStudy({ params }) {
  const { slug } = await params;
  const study = studies.find((s) => s.id === slug);
  if (!study) notFound();
  return (
    <main className="case-page section-wrap">
      <nav aria-label="Case study navigation">
        <Link href="/#work">← Selected work</Link>
        <Link href="/#contact">Contact Tamim ↗</Link>
      </nav>
      <p className="micro">ABDULLAH AL TAMIM / DHAKA, BANGLADESH</p>
      <h1>{titles[slug]}</h1>
      <p className="case-lead">{study.intro}</p>
      <div className="case-outcome">
        <strong>{study.metric}</strong>
        <p>{study.metricLabel}</p>
      </div>
      <p className="micro">{study.tools}</p>
      {[
        ["The problem", study.problem],
        [
          slug === "intelligence" ? "Team work & my role" : "My contribution",
          study.contribution,
        ],
        ["How it works", study.approach],
        ["What made it difficult", study.difficulty],
        ["Outcome", study.outcome],
      ].map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
      <p className="case-note">
        An anonymized account of professional work. No patient data, proprietary
        code or internal links are published.
      </p>
      <Link className="text-link" href={"/#" + slug}>
        Explore the interactive walkthrough ↗
      </Link>
    </main>
  );
}
