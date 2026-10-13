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
  title: "Abdullah Al Tamim | Data Automation & Applied AI",
  description:
    "Data automation, operational analytics, and applied machine learning. Explore the work and research of Abdullah Al Tamim, Senior Data Automation Analyst based in Dhaka.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Abdullah Al Tamim | Data Automation & Applied AI",
    description:
      "From complex data to clear decisions. Automation, analytics, and research.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/images/abdullah-al-tamim.png",
        width: 987,
        height: 1164,
        alt: "Abdullah Al Tamim",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Abdullah Al Tamim | Data Automation & Applied AI",
    description: "Automation, analytics, and research.",
    images: ["/images/abdullah-al-tamim.png"],
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
