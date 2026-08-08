"use client";

import { Layers, LayoutDashboard, Loader2, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { logoutUser } from "@/features/auth/api/logout";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useAuthStore } from "@/features/auth/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const { endSession } = useAuthSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch {
      // Clear local auth state even when the server session has expired.
    } finally {
      endSession();
      setIsLoggingOut(false);
      router.push("/");
      router.refresh();
    }
  };

  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin/posts"
      : "/dashboard/author/posts";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-900/8 bg-[#f3f5fa]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between px-5 md:h-[4.5rem] md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#2558e8] shadow-[0_8px_24px_rgba(37,88,232,0.25)] transition-transform group-hover:-rotate-3">
            <Layers className="size-4 text-white" />
          </div>
          <div>
            <span className="block font-heading text-base font-bold tracking-[-0.04em] text-slate-950">
              Mini CMS
            </span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
              Field notes
            </span>
          </div>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-xs font-semibold text-slate-500 md:flex">
          <Link href="/" className="transition-colors hover:text-slate-950">
            Featured
          </Link>
          <Link
            href="/#latest"
            className="transition-colors hover:text-slate-950"
          >
            Latest
          </Link>
        </div>

        {status === "loading" ? (
          <div
            className="h-7 w-24 animate-pulse rounded-lg bg-muted"
            aria-label="Checking authentication status"
          />
        ) : null}

        {status === "unauthenticated" ? (
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "border-slate-300 bg-white/70 text-slate-800 hover:bg-white",
            })}
          >
            <LogIn className="mr-1.5 h-3.5 w-3.5" />
            Sign In
          </Link>
        ) : null}

        {status === "authenticated" && user ? (
          <div className="flex items-center gap-2">
            <Link
              href={dashboardHref}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">{user.name}</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
