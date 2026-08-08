import { getPosts, PostList } from "@/features/posts";

export default async function HomePage() {
  const posts = await getPosts();

  return <PostList posts={posts} />;
}
