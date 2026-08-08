import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Post } from "../../types/post";
import {
  getPostPublishedDate,
  getPostSummary,
} from "../../utils/post-presentation";
import { PostCoverImage } from "../post-cover-image";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const publishedDate = getPostPublishedDate(post);
  const summary = getPostSummary(post);

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex h-full flex-col rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
    >
      <PostCoverImage
        src={post.image_url}
        alt=""
        className="aspect-[4/3] rounded-2xl ring-1 ring-slate-900/8"
        imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
      />

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em]">
          <span className="text-blue-700">
            {post.category?.name ?? "Editorial"}
          </span>
          {publishedDate ? (
            <>
              <span className="size-1 rounded-full bg-slate-300" />
              <span className="text-slate-400">{publishedDate}</span>
            </>
          ) : null}
        </div>

        <h3 className="mt-3 flex items-start gap-3 font-heading text-2xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-950 transition-colors group-hover:text-blue-700">
          <span>{post.title}</span>
          <ArrowUpRight
            className="mt-1 size-4 shrink-0 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {summary}
        </p>
        <p className="mt-auto pt-5 text-[11px] font-medium text-slate-400">
          By {post.author?.name ?? "Mini CMS Editorial"}
        </p>
      </div>
    </Link>
  );
}
