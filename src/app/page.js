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
      <Portfolio />
    </>
  );
}
