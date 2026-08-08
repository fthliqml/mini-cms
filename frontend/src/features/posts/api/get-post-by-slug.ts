import { ApiResponse, fetcher } from "@/lib/api";
import type { Post } from "../types/post";

export async function getPostBySlug(slug: string) {
  const response = await fetcher<ApiResponse<Post>>(`/posts/${slug}`);

  return response.data;
}
