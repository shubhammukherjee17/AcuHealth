import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`bg-[#202123] text-[#E9E9E9]`}>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex w-full">{children}</div>
      </SidebarProvider>
    </main>
  );
}
