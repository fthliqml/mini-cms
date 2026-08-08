import { Layers } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col font-sans">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 container items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">Mini CMS</span>
          </div>
        </div>
      </nav>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-3xl px-6 py-6 text-center text-sm text-muted-foreground">
          Mini CMS &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
