import { notFound } from "next/navigation";

import { getPostBySlug, PostDetail, type Post } from "@/features/posts";

interface PostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostDetailPage({
  params,
}: PostDetailPageProps) {
  const { slug } = await params;
  let post: Post;

  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return <PostDetail post={post} />;
}
