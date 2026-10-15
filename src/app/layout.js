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
    "Systems that reconcile fragmented data, automate repetitive work, and clarify decisions. Work and research by Abdullah Al Tamim, Senior Data Automations Analyst in Dhaka.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Abdullah Al Tamim | Data Automation & Applied AI",
    description:
      "Order from complexity. Data automation, operational intelligence, and applied machine learning.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdullah Al Tamim | Data Automation & Applied AI",
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
