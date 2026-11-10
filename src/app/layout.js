import localFont from "next/font/local";
import "./globals.css";
const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});
export const metadata = {
  metadataBase: new URL("https://abdullah-al-tamim.vercel.app"),
  title: "Abdullah Al Tamim | Data, AI & Useful Systems",
  description:
    "Abdullah Al Tamim: computer science graduate, builder and published research co-author. Exploring data science, AI and data engineering through research and useful software.",
  authors: [
    { name: "Abdullah Al Tamim", url: "https://abdullah-al-tamim.vercel.app" },
  ],
  creator: "Abdullah Al Tamim",
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Abdullah Al Tamim | Data, AI & Useful Systems",
    description:
      "Research, useful software and the person behind the work. Explore Abdullah Al Tamim’s interests in data, AI and engineering.",
    url: "/",
    type: "website",
    locale: "en_BD",
    siteName: "Abdullah Al Tamim",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdullah Al Tamim | Data, AI & Useful Systems",
    description: "Automation, analytics, and research.",
    images: ["/opengraph-image"],
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
