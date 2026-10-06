import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "US Sales Tax Nexus Tracker",
  description: "Track sales tax nexus thresholds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
