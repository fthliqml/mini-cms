import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface AuthorPostHeroProps {
  authorName: string;
  totalPosts?: number;
  onCreate: () => void;
}

export function AuthorPostHero({
  authorName,
  totalPosts,
  onCreate,
}: AuthorPostHeroProps) {
  const firstName = authorName.split(" ")[0];

  return (
    <section className="border-b border-slate-900/10 pb-10 pt-12 md:pb-14 md:pt-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to stories
      </Link>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-blue-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
              Author desk
            </p>
          </div>
          <h1 className="mt-5 max-w-3xl font-heading text-[clamp(3.25rem,8vw,6.75rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-slate-950">
            Your stories,
            <br />
            {firstName}.
          </h1>
        </div>

        <div className="border-l border-slate-900/12 pl-6">
          <p className="text-sm leading-6 text-slate-500">
            Draft, revise, and publish the articles assigned to you.
          </p>
          <p className="mt-4 text-xs font-semibold text-slate-950">
            {typeof totalPosts === "number"
              ? `${totalPosts} ${totalPosts === 1 ? "post" : "posts"} in your desk`
              : "Loading your posts"}
          </p>
          <Button
            type="button"
            size="lg"
            onClick={onCreate}
            className="mt-6 bg-blue-600 px-4 hover:bg-blue-700"
          >
            <Plus className="size-4" aria-hidden="true" />
            New post
          </Button>
        </div>
      </div>
    </section>
  );
}
