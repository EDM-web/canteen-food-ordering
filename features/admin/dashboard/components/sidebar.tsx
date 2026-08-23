"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Store,
  Folders,
} from "lucide-react";
import { signOut } from "@/features/auth/actions/sign-out";
import { adminCategoryPath } from "@/lib/path";

const navItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    url: "/admin/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Categories",
    url: adminCategoryPath,
    icon: Folders,
  },
  {
    title: "Menu Items",
    url: "/admin/dashboard/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Customers",
    url: "/admin/dashboard/customers",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Sidebar Header - Adjusted to h-14 to align perfectly with top header */}
      <SidebarHeader className="flex justify-center px-3 border-b h-14">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/admin/dashboard"
                className="flex justify-start items-center gap-3"
              >
                <div className="flex justify-center items-center bg-orange-600 shadow-sm rounded-lg w-8 h-8 font-bold text-white shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="group-data-[collapsible=icon]:hidden flex flex-col truncate">
                  <span className="font-bold text-sm leading-none">
                    Canteen Admin
                  </span>
                  <span className="mt-1 text-[10px] text-muted-foreground">
                    Management Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-[11px] text-muted-foreground/70 uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/admin/dashboard" &&
                    pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-orange-50 text-orange-600 font-semibold hover:bg-orange-100 hover:text-orange-700"
                          : "hover:bg-slate-100"
                      }
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-orange-600" : "text-slate-500"
                          }`}
                        />
                        <span
                          className={`truncate ${
                            isActive ? "text-orange-600" : "text-slate-500"
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-2 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut}>
              <SidebarMenuButton
                className="hover:bg-red-50 text-red-500 hover:text-red-700 cursor-pointer"
                tooltip="Logout"
                type="submit"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="truncate">Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
