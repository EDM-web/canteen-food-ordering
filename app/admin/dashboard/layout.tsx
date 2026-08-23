import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/dashboard/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col flex-1 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
        {/* Top Header line aligned with Sidebar Header (h-14) */}
        <header className="top-0 z-30 sticky flex justify-between items-center gap-2 bg-white px-4 border-b h-14 shrink-0">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hover:bg-slate-100 -ml-1 w-8 h-8 text-slate-600" />
            <Separator orientation="vertical" className="mr-2" />
            <span className="font-semibold text-slate-600 text-xs">
              Welcome {session?.user.name}
            </span>
          </div>
        </header>

        {/* Dynamic Children Content */}
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
