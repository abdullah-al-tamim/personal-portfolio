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
      name: "Abdullah Al Tamim — Data Automation & Analytics in Bangladesh",
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
        "Data automation, operational analytics and workflow engineering professional based in Dhaka, Bangladesh.",
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
