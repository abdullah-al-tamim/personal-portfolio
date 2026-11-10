const origin = "https://abdullah-al-tamim.vercel.app";
export const profileSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin,
      name: "Abdullah Al Tamim",
      inLanguage: "en",
      publisher: { "@id": origin + "/#person" },
    },
    {
      "@type": "ProfilePage",
      "@id": origin + "/#profile",
      url: origin,
      name: "Abdullah Al Tamim: Data, AI & Useful Systems",
      isPartOf: { "@id": origin + "/#website" },
      mainEntity: { "@id": origin + "/#person" },
    },
    {
      "@type": "Person",
      "@id": origin + "/#person",
      name: "Abdullah Al Tamim",
      url: origin,
      image: origin + "/images/abdullah-al-tamim.png",
      jobTitle: "Senior Data Automations Analyst",
      description:
        "Computer science graduate based in Dhaka, exploring data, AI and software through research and practical systems.",
      homeLocation: { "@type": "Place", name: "Dhaka, Bangladesh" },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "East West University, Bangladesh",
      },
      sameAs: [
        "https://github.com/abdullah-al-tamim",
        "https://linkedin.com/in/tamim--abdullah",
      ],
      knowsAbout: [
        "Data automation",
        "Data engineering",
        "Data analytics",
        "Python",
        "SQL",
        "Retool",
        "Playwright",
        "Selenium",
        "Applied machine learning",
      ],
    },
  ],
};
