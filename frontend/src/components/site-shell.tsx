import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="public-site flex min-h-screen flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
