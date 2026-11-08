import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sidaps Portfolio",
  description: "Portofolio pribadi, catatan pembelian dan penjualan, serta harga aset dalam satu tempat.",
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
