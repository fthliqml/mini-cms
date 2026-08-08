import { ArrowUpRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, getInitials } from "@/lib/utils";
import type { Post } from "../types/post";
import { getMarkdownPreview } from "../utils/markdown-preview";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const publishedDate = formatDate(post.published_at || post.created_at);
  const postContent = getMarkdownPreview(
    post.excerpt?.trim() || post.content || "",
  );

  return (
    <Link href={`/${post.slug}`} className="group block h-full cursor-pointer">
      <Card className="flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-md">
        <CardHeader>
          <div className="mb-1 flex items-center justify-between gap-2">
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

          <CardTitle className="flex items-start justify-between gap-2 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
            <span>{post.title}</span>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </CardTitle>

          {post.category?.description ? (
            <CardDescription className="line-clamp-1 text-xs text-muted-foreground/80">
              {post.category.description}
            </CardDescription>
          ) : null}
        </CardHeader>

        <CardContent className="flex-1">
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {postContent}
          </p>
        </CardContent>

        <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {getInitials(post.author?.name || "Admin")}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium leading-none text-foreground">
                {post.author?.name || "Anonymous"}
              </span>
              <span className="text-[10px] capitalize text-muted-foreground">
                {post.author?.role || "author"}
              </span>
            </div>
          </div>

          {publishedDate ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{publishedDate}</span>
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </Link>
  );
}
