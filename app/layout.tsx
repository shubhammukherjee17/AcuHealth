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
      <body className={`bg-[#202123] text-[#E9E9E9]`}>{children}</body>
    </html>
  );
}
