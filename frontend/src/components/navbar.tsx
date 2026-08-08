import { Layers, LogIn } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 container items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Layers className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">Mini CMS</span>
        </Link>
        <Link
          href="/login"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <LogIn className="h-3.5 w-3.5 mr-1.5" />
          Sign In
        </Link>
      </div>
    </nav>
  );
}
