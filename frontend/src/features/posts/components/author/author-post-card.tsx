import { ArrowUpRight, CalendarDays, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Post } from "../../types/post";
import { getPostSummary } from "../../utils/post-presentation";
import { PostCoverImage } from "../post-cover-image";

interface AuthorPostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function AuthorPostCard({
  post,
  onEdit,
  onDelete,
}: AuthorPostCardProps) {
  const isPublished = post.status === "published";

  return (
    <article className="group grid overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/8 transition-shadow hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:grid-cols-[15rem_minmax(0,1fr)]">
      <PostCoverImage
        src={post.image_url}
        alt=""
        className="aspect-[16/10] md:aspect-auto md:min-h-64"
        imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
      />

      <div className="flex min-w-0 flex-col p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className={
              isPublished
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600"
            }
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {post.category?.name ?? "Uncategorized"}
          </span>
        </div>

        <h2 className="mt-4 font-heading text-2xl font-semibold leading-tight tracking-[-0.045em] text-slate-950 md:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
          {getPostSummary(post)}
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            Updated {formatDate(post.updated_at)}
          </p>

          <div className="flex items-center gap-2">
            {isPublished ? (
              <Link
                href={`/${post.slug}`}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                View
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(post)}
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(post)}
              aria-label={`Delete ${post.title}`}
              className="text-slate-400 hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
