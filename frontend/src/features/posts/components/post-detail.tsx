import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import type { Post } from "../types/post";

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  const publishedDate = formatDate(post.published_at || post.created_at);

  return (
    <main className="container mx-auto w-full flex-1 px-6 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {post.category ? (
              <Badge variant="secondary" className="font-medium">
                {post.category.name}
              </Badge>
            ) : null}
            <Badge
              variant={post.status === "published" ? "default" : "outline"}
              className="capitalize text-[10px]"
            >
              {post.status}
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border/60 py-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {getInitials(post.author?.name || "Admin")}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none text-foreground">
                  {post.author?.name || "Anonymous"}
                </span>
                <span className="mt-0.5 text-xs capitalize text-muted-foreground">
                  {post.author?.role || "Author"}
                </span>
              </div>
            </div>

            {publishedDate ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>
            ) : null}
          </div>
        </div>

        {post.excerpt ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-base font-medium italic leading-relaxed text-foreground/90">
            {post.excerpt}
          </div>
        ) : null}

        <div className="prose prose-zinc max-w-none leading-relaxed dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <div className="mt-12 border-t border-border/60 pt-6">
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to All Articles
        </Link>
      </div>
    </main>
  );
}
