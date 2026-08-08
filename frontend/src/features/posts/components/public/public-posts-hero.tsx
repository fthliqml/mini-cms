export function PublicPostsHero() {
  return (
    <header className="grid gap-7 border-b border-slate-900/10 pb-10 md:grid-cols-[1.5fr_0.7fr] md:items-end md:pb-14">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-blue-600" />
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-700">
            Mini CMS / Field notes
          </p>
        </div>
        <h1 className="mt-5 max-w-4xl font-heading text-[clamp(3.5rem,9vw,7.6rem)] font-semibold leading-[0.84] tracking-[-0.075em] text-slate-950">
          Stories for people who build.
        </h1>
      </div>

      <p className="max-w-sm text-sm leading-6 text-slate-500 md:justify-self-end md:pb-1">
        Practical notes on software, design, careers, and the thoughtful work
        behind digital products.
      </p>
    </header>
  );
}
