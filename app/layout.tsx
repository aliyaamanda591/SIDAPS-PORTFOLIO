import type { Metadata } from "next";
import "./globals.css";
import { OFFICIAL_PORTFOLIO_ORIGIN } from "../lib/canonical-url";
import { SITE_TITLE, SITE_DESCRIPTION } from "../lib/site-seo";

export const metadata: Metadata = {
  metadataBase: new URL(OFFICIAL_PORTFOLIO_ORIGIN),
  alternates: { canonical: OFFICIAL_PORTFOLIO_ORIGIN },
  openGraph: {
    type: "website",
    url: OFFICIAL_PORTFOLIO_ORIGIN,
    siteName: "Sidaps Portfolio",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
