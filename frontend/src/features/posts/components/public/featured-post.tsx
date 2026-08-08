import { ArrowUpRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import type { Post } from "../../types/post";
import {
  getPostPublishedDate,
  getPostSummary,
} from "../../utils/post-presentation";
import { PostCoverImage } from "../post-cover-image";

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const publishedDate = getPostPublishedDate(post);
  const summary = getPostSummary(post);

  return (
    <section className="pt-10 md:pt-14" aria-labelledby="featured-heading">
      <div className="mb-5 flex items-center justify-between">
        <h2
          id="featured-heading"
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500"
        >
          Featured story
        </h2>
        <span className="font-heading text-xs font-semibold text-slate-400">
          Editor&apos;s pick
        </span>
      </div>

      <Link
        href={`/${post.slug}`}
        className="group grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_22px_70px_rgba(31,42,68,0.08)] ring-1 ring-slate-900/6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 md:grid-cols-[1.35fr_0.85fr]"
      >
        <div className="relative min-h-[19rem] overflow-hidden md:min-h-[34rem]">
          <PostCoverImage
            src={post.image_url}
            alt=""
            priority
            className="absolute inset-0 h-full w-full"
            imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
          />
          <div className="absolute bottom-5 left-5 rounded-full border border-white/50 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-800 backdrop-blur-md">
            {post.category?.name ?? "Editorial"}
          </div>
        </div>

        <div className="flex flex-col p-6 sm:p-9 md:p-10 lg:p-12">
          {publishedDate ? (
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              <span>{publishedDate}</span>
            </div>
          ) : null}

          <h3 className="mt-6 font-heading text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 transition-colors group-hover:text-blue-700 md:text-5xl">
            {post.title}
          </h3>
          <p className="mt-5 line-clamp-4 text-sm leading-6 text-slate-500">
            {summary}
          </p>

          <div className="mt-auto flex items-end justify-between gap-4 pt-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Written by
              </p>
              <p className="mt-1 font-heading text-sm font-semibold text-slate-800">
                {post.author?.name ?? "Mini CMS Editorial"}
              </p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-full bg-slate-950 text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
