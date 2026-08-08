import type { Post } from "../types/post";
import { PostCard } from "./post-card";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <main className="container mx-auto w-full flex-1 px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Public Posts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest articles and updates from Mini CMS.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
