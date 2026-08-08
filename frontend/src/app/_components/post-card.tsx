import { Post } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { formatDate, getInitials } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const dateString = post.published_at || post.created_at;
  const publishedDate = formatDate(dateString);
  const postContent = post.content || post.excerpt || "";
  const href = `/${post.slug || post.id}`;

  return (
    <Link href={href} className="group block cursor-pointer">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between gap-2 mb-1">
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

          <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors flex items-start justify-between gap-2">
            <span>{post.title}</span>
            <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 shrink-0 mt-1" />
          </CardTitle>

          {post.category?.description && (
            <CardDescription className="line-clamp-1 text-xs text-muted-foreground/80">
              {post.category.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
            {postContent}
          </p>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-t pt-3">
          {/* Author info */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {getInitials(post.author?.name || "Admin")}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground text-xs leading-none">
                {post.author?.name || "Anonymous"}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">
                {post.author?.role || "author"}
              </span>
            </div>
          </div>

          {/* Date */}
          {publishedDate && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{publishedDate}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
