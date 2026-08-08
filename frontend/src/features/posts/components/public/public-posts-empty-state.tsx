export function PublicPostsEmptyState() {
  return (
    <main className="mx-auto flex w-full max-w-[1180px] flex-1 items-center px-5 py-24 md:px-8">
      <div className="max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
          Mini CMS journal
        </p>
        <h1 className="mt-4 font-heading text-5xl font-semibold tracking-[-0.06em] text-slate-950">
          The first story is waiting to be written.
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-500">
          Published articles will appear here as soon as the editorial team
          sends them live.
        </p>
      </div>
    </main>
  );
}
