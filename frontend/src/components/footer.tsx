export function Footer() {
  return (
    <footer className="border-t border-slate-900/10 py-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="font-heading font-semibold tracking-tight text-slate-800">
          Mini CMS — ideas worth shipping.
        </p>
        <p>
          &copy; {new Date().getFullYear()} Muhammad Fatihul Iqmal
        </p>
      </div>
    </footer>
  );
}
