import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { AuthorPostRow } from "../types/dashboard";

interface AuthorPostsTableProps {
  posts: AuthorPostRow[];
}

export function AuthorPostsTable({ posts }: AuthorPostsTableProps) {
  return (
    <main className="container mx-auto w-full flex-1 px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Author Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your articles and drafts.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {posts.length > 0 ? (
            <div className="divide-y">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDate(post.updatedAt)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "outline"
                    }
                    className="capitalize"
                  >
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Post management has not been connected yet.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
