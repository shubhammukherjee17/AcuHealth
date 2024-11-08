import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamic = 'force-dynamic'

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
