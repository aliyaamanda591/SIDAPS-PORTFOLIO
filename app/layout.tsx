import type { Metadata } from "next";
import "./globals.css";
import { OFFICIAL_PORTFOLIO_ORIGIN } from "../lib/canonical-url";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_IMAGE, SITE_IMAGE_ALT } from "../lib/site-seo";

export const metadata: Metadata = {
  metadataBase: new URL(OFFICIAL_PORTFOLIO_ORIGIN),
  alternates: { canonical: OFFICIAL_PORTFOLIO_ORIGIN },
  openGraph: {
    type: "website",
    url: OFFICIAL_PORTFOLIO_ORIGIN,
    siteName: "Sidaps",
    locale: "id_ID",
    images: [{ url: SITE_IMAGE, width: 1672, height: 941, alt: SITE_IMAGE_ALT }],
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [{ url: SITE_IMAGE, alt: SITE_IMAGE_ALT }] },
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
