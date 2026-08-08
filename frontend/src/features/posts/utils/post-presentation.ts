import { formatDate } from "@/lib/utils";
import type { Post } from "../types/post";
import { getMarkdownPreview } from "./markdown-preview";

export function getPostPublishedDate(post: Post) {
  return formatDate(post.published_at || post.created_at);
}

export function getPostSummary(post: Post) {
  return getMarkdownPreview(post.excerpt?.trim() || post.content || "");
}

export function splitFeaturedPost(posts: Post[]) {
  const featuredPost = posts.find((post) => post.image_url) ?? posts[0];

  return {
    featuredPost,
    latestPosts: featuredPost
      ? posts.filter((post) => post.id !== featuredPost.id)
      : [],
  };
}
