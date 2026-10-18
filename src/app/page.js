import { profileSchema } from "@/assets/profile-schema";
import Portfolio from "@/components/Portfolio";
export default function Home() {
  return (
    <>
      <noscript>
        <nav className="no-js-nav" aria-label="Navigation without JavaScript">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#about">Profile</a>
          <a href="#cv">CV downloads</a>
          <a href="#contact">Contact</a>
        </nav>
      </noscript>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profileSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Portfolio />
    </>
  );
}
