"use client";

import { Layers, LayoutDashboard, Loader2, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { logoutUser } from "@/features/auth/api/logout";
import { useAuthStore } from "@/features/auth/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch {
      // Clear local auth state even when the server session has expired.
    } finally {
      clearUser();
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
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Layers className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">Mini CMS</span>
        </Link>

        {status === "loading" ? (
          <div
            className="h-7 w-24 animate-pulse rounded-lg bg-muted"
            aria-label="Checking authentication status"
          />
        ) : null}

        {status === "unauthenticated" ? (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "sm" })}
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
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
