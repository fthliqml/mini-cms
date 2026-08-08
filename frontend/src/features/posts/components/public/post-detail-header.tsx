import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import type { Post } from "../../types/post";
import { getPostPublishedDate } from "../../utils/post-presentation";

interface PostDetailHeaderProps {
  post: Post;
}

export function PostDetailHeader({ post }: PostDetailHeaderProps) {
  const publishedDate = getPostPublishedDate(post);
  const authorName = post.author?.name ?? "Anonymous";

  return (
    <header className="mx-auto max-w-5xl text-center">
      {post.category ? (
        <Badge className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white hover:bg-blue-600">
          {post.category.name}
        </Badge>
      ) : null}

      <h1 className="mt-7 font-heading text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-slate-950">
        {post.title}
      </h1>

      {post.excerpt ? (
        <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-slate-500 md:text-lg md:leading-8">
          {post.excerpt}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
            {getInitials(authorName)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold leading-none text-slate-900">
              {authorName}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">
              {post.author?.role ?? "Author"}
            </span>
          </div>
        </div>

        {publishedDate ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays className="size-4" aria-hidden="true" />
            <span>{publishedDate}</span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
