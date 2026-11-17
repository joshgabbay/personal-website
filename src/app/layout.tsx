import type { Metadata } from "next";
import "./plain.css";

export const metadata: Metadata = {
  title: "Josh Gabbay",
  description: "Josh Gabbay. Economics and Accounting at UC Santa Barbara.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
