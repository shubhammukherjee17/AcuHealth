import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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
      <body className={`bg-[#202123] text-[#E9E9E9]`}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex w-full">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
