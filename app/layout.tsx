import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "US Sales Tax Nexus Tracker",
  description: "Track and monitor your US sales tax nexus thresholds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
