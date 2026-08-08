import type { Post } from "../../types/post";
import { splitFeaturedPost } from "../../utils/post-presentation";
import { FeaturedPost } from "./featured-post";
import { LatestPosts } from "./latest-posts";
import { PublicPostsEmptyState } from "./public-posts-empty-state";
import { PublicPostsHero } from "./public-posts-hero";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const { featuredPost, latestPosts } = splitFeaturedPost(posts);

  if (!featuredPost) {
    return <PublicPostsEmptyState />;
  }

  return (
    <main className="w-full flex-1 overflow-hidden">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <PublicPostsHero />
        <FeaturedPost post={featuredPost} />
        <LatestPosts posts={latestPosts} />
      </div>
    </main>
  );
}
