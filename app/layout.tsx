import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Allergy Tag QR Generator",
    template: "%s | Allergy Tag QR Generator",
  },
  description:
    "Create local-first printable QR barcode tags for kids' allergy and emergency information.",
  applicationName: "Allergy Tag QR Generator",
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
