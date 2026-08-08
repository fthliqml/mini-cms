import { getPost } from "@/services/post";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate, getInitials } from "@/lib/utils";

interface PostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPost(slug);
  } catch (error) {
    console.error("Failed to fetch post detail:", error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  const publishedDate = formatDate(post.published_at || post.created_at);

  return (
    <div className="flex flex-1 flex-col font-sans min-h-screen bg-background">
      {/* ── Main Article ── */}
      <main className="mx-auto w-full container flex-1 px-6 py-8">
        {/* Back button above article */}
        <div className="mb-6">
          <Link
            href="/"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Home
          </Link>
        </div>

        <article className="space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {post.category && (
                <Badge variant="secondary" className="font-medium">
                  {post.category.name}
                </Badge>
              )}
              {post.status && (
                <Badge
                  variant={
                    post.status === "published"
                      ? "default"
                      : post.status === "draft"
                        ? "outline"
                        : "destructive"
                  }
                  className="capitalize text-[10px]"
                >
                  {post.status}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl leading-tight">
              {post.title}
            </h1>

            {/* Author & Date Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border/60 py-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {getInitials(post.author?.name || "Admin")}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground text-sm leading-none">
                    {post.author?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize mt-0.5">
                    {post.author?.role || "Author"}
                  </span>
                </div>
              </div>

              {publishedDate && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{publishedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Excerpt if available */}
          {post.excerpt && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-base font-medium text-foreground/90 italic leading-relaxed">
              {post.excerpt}
            </div>
          )}

          {/* Markdown Content Body */}
          <div className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Back Link at bottom */}
        <div className="mt-12 border-t border-border/60 pt-6">
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to All Articles
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-6">
        <div className="mx-auto container px-6 text-center text-xs text-muted-foreground">
          Mini CMS &copy; {new Date().getFullYear()} - Muhammad Fatihul Iqmal
        </div>
      </footer>
    </div>
  );
}
