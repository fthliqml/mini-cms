"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { adminDashboardNavigation } from "../config/navigation";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
}

function DashboardLoading() {
  return (
    <div className="flex min-h-svh bg-slate-50">
      <div className="hidden w-64 animate-pulse bg-slate-950 md:block" />
      <div className="flex flex-1 flex-col">
        <div className="h-14 border-b bg-white" />
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  const isAdmin = user?.role === "admin";
  const hasAdminAccess = isAdmin && pathname.startsWith("/dashboard/admin");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated" && user?.role === "author") {
      router.replace("/author/posts");
      return;
    }

    if (status === "authenticated" && isAdmin && !hasAdminAccess) {
      router.replace("/dashboard/admin/posts");
    }
  }, [hasAdminAccess, isAdmin, router, status, user?.role]);

  if (status !== "authenticated" || !user || !hasAdminAccess) {
    return <DashboardLoading />;
  }

  const currentPage =
    adminDashboardNavigation.find((item) => pathname.startsWith(item.href))
      ?.title ??
    "Dashboard";

  return (
    <TooltipProvider>
      <SidebarProvider
        className="dashboard-shell bg-slate-50"
        style={{ "--sidebar-width": "17rem" } as React.CSSProperties}
      >
        <DashboardSidebar user={user} />
        <SidebarInset className="min-w-0 bg-slate-50">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl md:px-6">
            <SidebarTrigger className="-ml-1 text-slate-600" />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden text-slate-400 sm:inline">Workspace</span>
              <span className="hidden text-slate-300 sm:inline">/</span>
              <span className="truncate font-medium text-slate-800">
                {currentPage}
              </span>
            </div>
            <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {user.role}
            </span>
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
