import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackToStoriesLinkProps {
  label?: string;
  variant?: "ghost" | "outline";
  className?: string;
}

export function BackToStoriesLink({
  label = "Back to stories",
  variant = "ghost",
  className,
}: BackToStoriesLinkProps) {
  return (
    <Link
      href="/"
      className={cn(
        buttonVariants({ variant, size: "sm" }),
        className,
      )}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
