export function Footer() {
  return (
    <footer className="border-t border-border/50 py-6">
      <div className="container mx-auto px-6 text-center text-xs text-muted-foreground">
        Mini CMS &copy; {new Date().getFullYear()} - Muhammad Fatihul Iqmal
      </div>
    </footer>
  );
}
