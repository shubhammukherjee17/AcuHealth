import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI HealthCare",
  description: "AI HealthCare is a platform for healthcare professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  );
}
